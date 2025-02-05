export class AuthUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
