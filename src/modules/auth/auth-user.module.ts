import { Module } from '@nestjs/common';
import { AuthUserHandler } from './commands/auth-user/auth-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUserController } from './controllers/auth-user.controller';
import { AuthUserService } from './services/auth-user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/services/user.repository';
import { PassportModule } from '@nestjs/passport';
import { UserModel } from '../user/entities/user';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const CommandHandlers = [AuthUserHandler];

export const Controllers = [AuthUserController];
export const Services = [AuthUserService];
export const Repositories = [UserRepository];

@Module({
  imports: [
    UserModel,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('app.jwt.secret.key'),
        signOptions: {
          expiresIn: `${configService.get<string>('app.jwt.expirationDays')}d`,
        },
      }),
    }),
    PassportModule,
    CqrsModule,
  ],
  controllers: [...Controllers],
  providers: [...Repositories, ...Services, ...CommandHandlers],
  exports: [JwtModule, ...Repositories, ...Services],
})
export class AuthUserModule {}
