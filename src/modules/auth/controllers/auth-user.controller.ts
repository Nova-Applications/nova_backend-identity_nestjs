import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { AuthenticationRequest } from './models/auth.request';
import { CommandBus } from '@nestjs/cqrs';
import { AuthUserCommand } from '../commands/auth-user/auth-user.command';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('authentication')
@UseFilters(HttpExceptionFilter)
export class AuthUserController {
  constructor(private commandBus: CommandBus) {}

  @Post('/auth')
  public async login(@Body() auth: AuthenticationRequest) {
    const command = new AuthUserCommand(auth.email, auth.password);
    return await this.commandBus.execute(command);
  }
}
