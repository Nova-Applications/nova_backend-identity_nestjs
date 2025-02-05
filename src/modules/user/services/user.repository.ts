import { Injectable } from '@nestjs/common';
import { Guid } from 'guid-typescript';
import * as bcrypt from 'bcrypt';
import { BaseRepository } from '../../../shared/repository.base';
import { UserModel } from '../../user/entities/user';
import { ConfigService } from '@nestjs/config';
import { Role } from '../../../shared/enums/role.enum';

@Injectable()
export class UserRepository extends BaseRepository<UserModel> {
  constructor(private readonly configService: ConfigService) {
    super(
      configService.get<string>('database.cosmos.endpoint'),
      configService.get<string>('database.cosmos.apiKey'),
      configService.get<string>('database.cosmos.dbId'),
      configService.get<string>('database.cosmos.dbUser'),
    );
  }

  public async getUserByIdAsync(id: string): Promise<UserModel> {
    const query = `select * from c where c.id = '${id}'`;
    const user = await this.query(query);
    return user ? user[0] : null;
  }

  public async getUserByUsernameAsync(username: string): Promise<UserModel> {
    const query = `select * from c where c.username = '${username}'`;
    const user = await this.query(query);
    return user ? user[0] : null;
  }

  public async getUserByEmailAsync(email: string): Promise<UserModel> {
    const query = `select * from c where c.email = '${email}'`;
    const user = await this.query(query);
    return user ? user[0] : null;
  }

  public async emailExistsAsync(email: string, id?: string): Promise<boolean> {
    let query = `select * from c where c.email = '${email}'`;
    if (id) {
      query += `and  c.id != ${id}`;
    }

    const user = await this.query(query);
    return user[0] ? true : false;
  }

  public async validateEmailAsync(
    email: string,
    userId?: string,
  ): Promise<boolean> {
    const isDuplicated = await this.emailExistsAsync(email, userId);
    if (isDuplicated) {
      throw new Error('Email already register');
    }

    return true;
  }

  public async validateEmailAndPasswordAsync(
    email: string,
    password: string,
  ): Promise<UserModel> {
    const query = `select * from c where c.email = '${email}'`;
    const user = await this.query(query);

    if (user && user[0]) {
      const isValid = await this.comparePasswordAsync(
        password,
        user[0].password,
      );
      if (isValid) {
        return user[0];
      }
    }

    return null;
  }

  public async createEntityAsync(user: UserModel): Promise<UserModel> {
    const newUser = new UserModel();
    newUser.id = Guid.create().toString();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.username = user.email;
    newUser.email = user.email;
    newUser.password = await this.encryptPasswordAsync(user.password);

    newUser.imageUrl = user.imageUrl || null;
    newUser.phoneNumber = user.phoneNumber || null;
    newUser.identificationType = user.identificationType || null;
    newUser.identificationNumber = user.identificationNumber || null;

    newUser.createdAt = new Date().toISOString();
    newUser.createdBy = user.createdBy || 'SYSTEM';
    newUser.roles = user.roles || [Role.USER];

    return newUser;
  }

  public async updateEntityAsync(
    oldUser: UserModel,
    newUser: UserModel,
  ): Promise<UserModel> {
    newUser.id = oldUser.id;
    newUser.username = oldUser.username;
    newUser.email = oldUser.email;

    newUser.firstName = newUser.firstName ?? oldUser.firstName;
    newUser.lastName = newUser.lastName ?? oldUser.lastName;
    newUser.password = newUser.password
      ? await this.encryptPasswordAsync(newUser.password)
      : oldUser.password;

    newUser.imageUrl = newUser.imageUrl ?? oldUser.imageUrl;
    newUser.phoneNumber = newUser.phoneNumber ?? oldUser.phoneNumber;
    newUser.identificationType =
      newUser.identificationType ?? oldUser.identificationType;
    newUser.identificationNumber =
      newUser.identificationNumber ?? oldUser.identificationNumber;
    newUser.roles = newUser.roles ?? oldUser.roles;

    newUser.createdAt = oldUser.createdAt;
    newUser.createdBy = oldUser.createdBy;
    newUser.updatedAt = new Date().toISOString();
    newUser.updatedBy = newUser.updatedBy ?? oldUser.updatedBy ?? 'SYSTEM';

    return newUser;
  }

  private async encryptPasswordAsync(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async comparePasswordAsync(
    password: string,
    hashedPassword: string,
  ): Promise<string> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
