export interface TransactionOutput {
  id: string;
  publicId: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  typeCode: string;
  typeName: string;
  statusCode: string;
  statusName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}