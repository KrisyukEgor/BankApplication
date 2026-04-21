import { TRANSACTION_STATUS_ENUM, TransactionStatus } from "./transaction-status.entity";

export interface TransactionDomainProps {
  id: string;
  publicId: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  typeCode: string;
  statusCode: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TransactionDomain {
  private props: TransactionDomainProps;

  constructor(props: TransactionDomainProps) {
    this.props = {
      ...props,
      amount: props.amount,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  get id(): string { return this.props.id; }
  get publicId(): string { return this.props.publicId; }
  get fromAccountId(): string | undefined { return this.props.fromAccountId; }
  get toAccountId(): string | undefined { return this.props.toAccountId; }
  get amount(): number { return this.props.amount; }
  get typeCode(): string { return this.props.typeCode; }
  get statusCode(): string { return this.props.statusCode; }
  get description(): string { return this.props.description || ''; }
  get createdAt(): Date { return new Date(this.props.createdAt!); }
  get updatedAt(): Date { return new Date(this.props.updatedAt!); }

  complete(): void {
    if (this.props.statusCode !== TRANSACTION_STATUS_ENUM.PENDING) {
      throw new Error('Only pending transaction can be completed');
    }
    this.props.statusCode = TRANSACTION_STATUS_ENUM.COMPLETED;
    this.props.updatedAt = new Date();
  }

  fail(): void {
    if (this.props.statusCode !== TRANSACTION_STATUS_ENUM.PENDING) {
      throw new Error('Only pending transaction can be failed');
    }
    this.props.statusCode = TRANSACTION_STATUS_ENUM.FAILED;
    this.props.updatedAt = new Date();
  }

  isPending(): boolean {
    return this.props.statusCode === TRANSACTION_STATUS_ENUM.PENDING;
  }
}