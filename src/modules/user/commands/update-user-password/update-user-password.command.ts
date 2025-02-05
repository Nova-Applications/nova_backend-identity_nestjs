export class UpdateUserPasswordCommand {
  constructor(
    public readonly userId: string,
    public readonly password: string,
  ) {}
}
