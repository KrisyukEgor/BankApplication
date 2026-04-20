export interface AccountTypeProps {
  id: string;             
  code: string;            
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AccountType {
  private props: AccountTypeProps;

  constructor(props: AccountTypeProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description || ''; }
  get createdAt(): Date { return new Date(this.props.createdAt!); }
  get updatedAt(): Date { return new Date(this.props.updatedAt!); }
}