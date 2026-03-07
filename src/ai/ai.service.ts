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
      model: 'gemini-3.1-flash-lite-preview',
    });
  }

  async extractExpensesFromPdf(
    pdfBuffer: Buffer,
    categories: string[],
  ): Promise<AiResponse> {
    const prompt = `
Você é um assistente financeiro especializado em extrair dados de faturas de cartão de crédito.

Analise o PDF da fatura fornecida e extraia todas as despesas.

Regras:
- Categorize cada despesa usando APENAS uma das categorias: ${categories.join(', ')}
- Se não souber a categoria, use "Outros"
- Normalize a descrição (ex: "UBER*TRIP123" → "Uber")
- Retorne APENAS o JSON abaixo, sem texto adicional, sem markdown, sem explicações

Formato obrigatório:
{
  "totalAmount": 1500.00,
  "dueDate": "2024-01-15",
  "expenses": [
    {
      "date": "2024-01-05",
      "descriptionOriginal": "texto exato da fatura",
      "descriptionNormalized": "nome normalizado",
      "merchantName": "nome do estabelecimento ou null",
      "amount": 25.90,
      "categoryName": "Transporte",
      "installmentCurrent": 1,
      "installmentTotal": 3
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
