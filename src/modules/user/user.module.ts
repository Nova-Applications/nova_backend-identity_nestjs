import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserInfoHandler } from './queries/user-info/user-info.handler';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './services/user.repository';
import { AuthUserModule } from '../auth/auth-user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/role.guard';
import { CreateUserHandler } from './commands/create-user/create-user.handler';

export const CommandHandlers = [UserInfoHandler, CreateUserHandler];

export const Controllers = [UserController];
export const Repositories = [UserRepository];

@Module({
  imports: [CqrsModule, AuthUserModule],
  controllers: [UserController],
  providers: [
    ...Repositories,
    ...CommandHandlers,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [...Repositories, ...CommandHandlers],
})
export class UserModule {}
