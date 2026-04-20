export interface CustomerProps {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer {
  private props: Required<CustomerProps>;

  constructor(props: CustomerProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get userId(): string { return this.props.userId; }
  public get firstName(): string { return this.props.firstName; }
  public get lastName(): string { return this.props.lastName; }
  public get middleName(): string { return this.props.middleName; }
  public get phoneNumber(): string { return this.props.phoneNumber; }
  public get createdAt(): Date { return new Date(this.props.createdAt); }
  public get updatedAt(): Date { return new Date(this.props.updatedAt); }

  public updatePersonalInfo(data: Partial<Pick<CustomerProps, 'firstName' | 'lastName' | 'middleName' | 'phoneNumber'>>): void {
    Object.assign(this.props, data);
    this.props.updatedAt = new Date();
  }
}