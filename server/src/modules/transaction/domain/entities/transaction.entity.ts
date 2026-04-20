export interface TransactionDomainProps {
  id: string;
  publicId: string;
  fromAccountId?: string;
  toAccountId?: string;
  amount: number;
  typeId: string;
  statusId: string;
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
  get typeId(): string { return this.props.typeId; }
  get statusId(): string { return this.props.statusId; }
  get description(): string { return this.props.description || ''; }
  get createdAt(): Date { return new Date(this.props.createdAt!); }
  get updatedAt(): Date { return new Date(this.props.updatedAt!); }

  complete(): void {
    if (this.props.statusId !== 'PENDING') throw new Error('Only pending transaction can be completed');
    this.props.statusId = 'COMPLETED';
    this.props.updatedAt = new Date();
  }

  fail(): void {
    if (this.props.statusId !== 'PENDING') throw new Error('Only pending transaction can be failed');
    this.props.statusId = 'FAILED';
    this.props.updatedAt = new Date();
  }
}