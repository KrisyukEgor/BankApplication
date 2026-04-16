export class AuditLogEvent {
  constructor(
    public readonly action: string,
    public readonly userId: string,
    public readonly payload: any
  ) {}

}