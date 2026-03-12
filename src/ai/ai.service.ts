import { Injectable } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { env } from 'src/config/env';
import { AiResponse } from './interfaces/ai-response.interface';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: env.GEMINI_MODEL,
    });
  }

  async extractExpensesFromPdf(
    pdfBuffer: Buffer,
    categories: string[],
  ): Promise<AiResponse> {
    const prompt = `
Você é um assistente financeiro especializado em extrair dados de faturas de cartão de crédito brasileiras.

Você receberá uma fatura em PDF que pode ser de qualquer banco brasileiro (Bradesco, Itaú, Nubank, Inter, C6, Santander, etc). Cada banco tem um layout diferente, mas todas contêm uma tabela de lançamentos.

## Tarefa
Extraia APENAS as compras e débitos da fatura. Retorne os dados no formato JSON especificado abaixo.

## Como identificar os lançamentos corretos
- Procure pela seção chamada "Lançamentos", "Extrato", "Transações" ou similar
- Os lançamentos estão em uma tabela com colunas de data, descrição e valor
- Extraia APENAS os valores da coluna de valor em R$ de cada lançamento
- Cada linha da tabela é um lançamento separado

## O que IGNORAR obrigatoriamente
- Pagamentos, créditos e estornos (ex: "PAGTO POR DEB EM C/C", "CRÉDITO", "ESTORNO")
- Valores de limite de crédito e limite de saque
- Valores de juros, IOF, multas e encargos
- Opções de parcelamento da fatura
- Pagamento mínimo e pagamento total
- Totais e subtotais da fatura
- Qualquer valor que não seja de uma compra/débito individual

## Regras para extração
- Os valores devem ser EXATAMENTE os mesmos da fatura — NUNCA estime, arredonde ou invente valores
- Se não conseguir ler o valor exato de um lançamento, OMITA esse lançamento completamente
- Datas devem estar no formato ISO: "YYYY-MM-DD"
- Valores devem ser números positivos com no máximo 2 casas decimais
- Para compras parceladas, identifique o número da parcela atual e o total (ex: "2/12")
- O campo "totalAmount" deve ser EXATAMENTE o valor total da fatura impresso no PDF
- O campo "dueDate" deve ser EXATAMENTE a data de vencimento impressa no PDF

## Categorização
- Use APENAS uma das categorias: ${categories.join(', ')}
- Se não souber a categoria, use "Outros"
- Baseie a categorização no nome do estabelecimento, não no valor

## Normalização
- Normalize a descrição removendo códigos, asteriscos e caracteres especiais
- Exemplos: "UBER*TRIP123" → "Uber", "MP*MCDONALDS" → "McDonalds", "RaiaDrogasilSA" → "Raia Drogasil"
- Mantenha o nome do estabelecimento reconhecível

## Formato obrigatório de resposta
Retorne APENAS o JSON abaixo, sem texto adicional, sem markdown, sem explicações, sem blocos de código:
{
  "totalAmount": 533.73,
  "dueDate": "2025-09-10",
  "expenses": [
    {
      "date": "2025-08-01",
      "descriptionOriginal": "texto exato da fatura",
      "descriptionNormalized": "nome normalizado",
      "merchantName": "nome do estabelecimento ou null",
      "amount": 21.59,
      "categoryName": "Farmácia",
      "installmentCurrent": null,
      "installmentTotal": null
    }
  ]
}
`;

    const base64Pdf = pdfBuffer.toString('base64');

    const result = await this.model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Pdf,
        },
      },
    ]);

    const text = result.response.text();
    try {
      const parsed: AiResponse = JSON.parse(text);
      return parsed;
    } catch {
      throw new Error('Gemini retornou resposta inválida');
    }
  }
}
