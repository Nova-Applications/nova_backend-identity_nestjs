import { Role } from '../../../../shared/enums/role.enum';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly phoneNumber: string,
    public readonly identificationType: string,
    public readonly identificationNumber: string,
    public readonly roles: Role[],
    public readonly updatedBy: string,
  ) {}
}
