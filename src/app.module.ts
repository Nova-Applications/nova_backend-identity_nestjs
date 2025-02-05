import { Module } from '@nestjs/common';
import { AuthUserModule } from './modules/auth/auth-user.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import environment from './config/environment.config';
import app from './config/app.config';
import database from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment, database, app],
    }),
    AuthUserModule,
    UserModule,
  ],
})
export class AppModule {}
