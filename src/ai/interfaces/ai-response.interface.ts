export interface AiExpense {
  date: string;
  descriptionOriginal: string;
  descriptionNormalized: string;
  merchantName: string | null;
  amount: number;
  categoryName: string;
  installmentCurrent: number | null;
  installmentTotal: number | null;
}

export interface AiResponse {
  totalAmount: number;
  dueDate: string;
  expenses: AiExpense[];
}
