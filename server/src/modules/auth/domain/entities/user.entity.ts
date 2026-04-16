import { Role } from "./role.entity";

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string; 
  roleId: number;
  role?: Role,  
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
     private props: UserProps & { createdAt: Date; updatedAt: Date };

    constructor(props: UserProps) {
        this.props = {
            ...props,
            createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
            updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
            role: props.role
        };
    }

    public get id(): string {
        return this.props.id;
    }

    public get email(): string {
        return this.props.email;
    }
    
    public get passwordHash(): string {
        return this.props.passwordHash;
    }

    public get role() {
        return this.props.role;
    }

    public get roleId() {
        return this.props.roleId;
    }

    public get createdAt(): Date {
        return new Date(this.props.createdAt); 
    }

    public get updatedAt(): Date {
        return new Date(this.props.updatedAt);
    }
    
}
