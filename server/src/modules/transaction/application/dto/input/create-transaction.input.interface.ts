export interface CreateTransactionInput {
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  typeCode: string;      
  description?: string;
}