import { EntityBase } from '../../../shared/entity.base';
import { Role } from '../../../shared/enums/role.enum';

export class UserModel extends EntityBase {
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  password: string;
  phoneNumber: string;
  identificationType: string;
  identificationNumber: string;
  roles: Role[];
}
