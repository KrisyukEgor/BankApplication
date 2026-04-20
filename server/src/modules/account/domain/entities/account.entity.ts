export interface AccountProps {
  id: string;
  customerId: string;
  number: string;         
  balance: number;       
  typeId: string;         
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account {
  private props: Required<AccountProps>;

  constructor(props: AccountProps) {
    this.props = {
      ...props,
      balance: props.balance || 0,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  get id(): string { return this.props.id; }
  get customerId(): string { return this.props.customerId; }
  get number(): string { return this.props.number; }
  get balance(): number { return this.props.balance; }
  get typeId(): string { return this.props.typeId; }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.props.balance += amount;
    this.props.updatedAt = new Date();
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    if (this.props.balance < amount) throw new Error('Insufficient funds');
    this.props.balance -= amount;
    this.props.updatedAt = new Date();
  }

  canBeClosed(): boolean {
    return this.props.balance === 0;
  }
}