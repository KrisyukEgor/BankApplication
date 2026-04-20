export enum TRANSACTION_STATUS_ENUM {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface TransactionStatusProps {
  id: string;
  code: string;     
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TransactionStatus {
  private props: Required<TransactionStatusProps>;

  constructor(props: TransactionStatusProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  get id(): string { 
    return this.props.id; 
  }

  get code(): string { 
    return this.props.code; 
  }

  get name(): string { 
    return this.props.name; 
  }

  get createdAt(): Date { 
    return new Date(this.props.createdAt); 
  }

  get updatedAt(): Date { 
    return new Date(this.props.updatedAt); 
  }
}
