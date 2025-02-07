import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserInfoHandler } from './queries/user-info/user-info.handler';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './services/user.repository';
import { AuthUserModule } from '../auth/auth-user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/role.guard';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { UpdateUserImageHandler } from './commands/update-user-image/update-user-image.handler';
import { UpdateUserPasswordHandler } from './commands/update-user-password/update-user-password.handler';

export const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserImageHandler,
  UpdateUserPasswordHandler,
];
export const QueryHandlers = [UserInfoHandler];

export const Controllers = [UserController];
export const Repositories = [UserRepository];

@Module({
  imports: [CqrsModule, AuthUserModule],
  controllers: [UserController],
  providers: [
    ...Repositories,
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [...Repositories, ...QueryHandlers, ...CommandHandlers],
})
export class UserModule {}
