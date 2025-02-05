import { UserModel } from '../../entities/user';
import { UserInfoResponse } from '../models/user-info.response';

const mapUserToResponse = (user: UserModel): UserInfoResponse => {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    email: user.email,
    phoneNumber: user.phoneNumber,
    identificationType: user.identificationType,
    identificationNumber: user.identificationNumber,
    roles: user.roles,
  };
};

export { mapUserToResponse };
