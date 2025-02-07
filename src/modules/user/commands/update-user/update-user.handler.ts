import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../services/user.repository';
import { UserModel } from '../../entities/user';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<UserModel> {
    try {
      const updatedUser = new UserModel();
      updatedUser.firstName = command.firstName;
      updatedUser.lastName = command.lastName;
      updatedUser.password = command.password;

      updatedUser.phoneNumber = command.phoneNumber;
      updatedUser.identificationType = command.identificationType;
      updatedUser.identificationNumber = command.identificationNumber;
      updatedUser.roles = command.roles;

      updatedUser.updatedBy = command.updatedBy;
      
      const oldEntity = await this.userRepository.getUserByIdAsync(command.id);
      const entity = await this.userRepository.updateEntityAsync(oldEntity, updatedUser);

      return await this.userRepository.update(entity.id, entity);
    } catch (error) {
      throw error;
    }
  }
}
