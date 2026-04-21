export interface GetTransactionsInput {
  accountId?: string;      
  fromDate?: Date;
  toDate?: Date;
  typeCode?: string;       
  statusCode?: string;    
}