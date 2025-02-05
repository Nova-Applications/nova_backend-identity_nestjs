import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../services/user.repository';
import { UserModel } from '../../entities/user';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserModel> {
    try {
      const newUser = new UserModel();
      newUser.username = command.email;
      newUser.firstName = command.firstName;
      newUser.lastName = command.lastName;
      newUser.email = command.email;
      newUser.password = command.password;

      newUser.phoneNumber = command.phoneNumber;
      newUser.identificationType = command.identificationType;
      newUser.identificationNumber = command.identificationNumber;
      newUser.roles = command.roles;

      newUser.createdBy = command.createdBy;

      const entity = await this.userRepository.createEntityAsync(newUser);
      return await this.userRepository.create(entity);
    } catch (error) {
      throw error;
    }
  }
}
