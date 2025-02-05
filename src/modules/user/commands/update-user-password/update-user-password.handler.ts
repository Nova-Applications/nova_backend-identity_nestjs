import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../services/user.repository';
import { UserModel } from '../../entities/user';
import { UpdateUserPasswordCommand } from './update-user-password.command';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserImageHandler
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(private userRepository: UserRepository) {}

  async execute(command: UpdateUserPasswordCommand): Promise<boolean> {
    try {
      const oldUser = await this.userRepository.getUserByIdAsync(
        command.userId,
      );

      // if password is not change return error
      const isPasswordNotChange =
        await this.userRepository.validateEmailAndPasswordAsync(
          oldUser.email,
          command.password,
        );
      if (isPasswordNotChange) {
        return false;
      }

      const newUser = new UserModel();
      newUser.password = command.password;

      const newEntity = await this.userRepository.updateEntityAsync(
        oldUser,
        newUser,
      );
      await this.userRepository.update(command.userId, newEntity);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
