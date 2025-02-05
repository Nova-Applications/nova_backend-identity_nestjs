import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthUserCommand } from './auth-user.command';
import { AuthUserService } from '../../services/auth-user.service';
import { AuthenticationRequest } from '../../controllers/models/auth.request';
import { AuthenticationResponse } from '../../controllers/models/auth.response';

@CommandHandler(AuthUserCommand)
export class AuthUserHandler implements ICommandHandler<AuthUserCommand> {
  constructor(private authUserService: AuthUserService) {}

  async execute(command: AuthUserCommand): Promise<AuthenticationResponse> {
    try {
      const auth = new AuthenticationRequest();
      auth.email = command.email;
      auth.password = command.password;

      return await this.authUserService.createToken(auth);
    } catch (error) {
      throw error;
    }
  }
}
