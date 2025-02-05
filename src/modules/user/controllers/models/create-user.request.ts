import { Role } from "../../../../shared/enums/role.enum";

export class UserInfoResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    email: string;
    phoneNumber: string;
    identificationType: string;
    identificationNumber: string;
    roles: Role[];
  }
  