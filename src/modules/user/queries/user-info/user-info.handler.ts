import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserInfoQuery } from './user-info.query';
import { UserRepository } from '../../services/user.repository';
import { UserInfoResponse } from '../../controllers/models/user-info.response';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mapUserToResponse } from '../../controllers/mapper/user.mapper';
import { UserModel } from '../../entities/user';

@QueryHandler(UserInfoQuery)
export class UserInfoHandler implements IQueryHandler<UserInfoQuery> {
  constructor(private userRepository: UserRepository) {}

  async execute(query: UserInfoQuery): Promise<UserInfoResponse> {
    try {
      if (!query.id && !query.email) {
        throw new BadRequestException();
      }

      let user = new UserModel();

      if (query.id) {
        user = await this.userRepository.getUserByIdAsync(query.id);
      }

      if (query.email) {
        user = await this.userRepository.getUserByEmailAsync(query.email);
      }

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return mapUserToResponse(user);
    } catch (error) {
      throw error;
    }
  }
}
