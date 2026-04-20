

export interface OperationProps {
  id: string;
  transactionId: string;
  accountId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Operation {
  private props: Required<OperationProps>;

  constructor(props: OperationProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt? new Date(props.updatedAt) : new Date()
    }
  }

  public get id() {
    return this.props.id;
  }

  public get transactionId() {
    return this.props.transactionId;
  }

  public get accountId() {
    return this.props.accountId;
  }

  public get amount() {
    return this.props.amount;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }
}