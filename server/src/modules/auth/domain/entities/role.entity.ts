export enum ROLES_ENUM {
  ADMIN = "ADMIN",
  USER = "USER",
  WORKER = "WORKER"
}

export interface RoleProps {
  id: number;
  code: string;
  name: string;
}

export class Role {
  private props: RoleProps;

  constructor(props: RoleProps) {
    this.props = {
      ...props
    }
  }

  isAdmin(): boolean {
    return this.props.code === ROLES_ENUM.ADMIN;
  }

  isUser(): boolean {
    return this.props.code === ROLES_ENUM.USER;
  }

  isWorker(): boolean {
    return this.props.code === ROLES_ENUM.WORKER;
  }

  get code() {
    return this.props.code;
  }

  get name() {
    return this.props.name;
  }

  get id() {
    return this.props.id;
  }
}