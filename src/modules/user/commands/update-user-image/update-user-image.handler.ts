import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserImageCommand } from './update-user-image.command';
import { BlobStorageClient } from '../../../../shared/storage/blob-storage.client';
import { UserRepository } from '../../services/user.repository';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../entities/user';

@CommandHandler(UpdateUserImageCommand)
export class UpdateUserImageHandler
  implements ICommandHandler<UpdateUserImageCommand>
{
  private readonly blobStorageClient: BlobStorageClient;

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.blobStorageClient = new BlobStorageClient(configService);
  }

  async execute(command: UpdateUserImageCommand): Promise<UserModel> {
    try {
      const oldUser = await this.userRepository.getUserByIdAsync(
        command.userId,
      );
      const imageUrl = await this.blobStorageClient.uploadFile(command.file);

      const newUser = new UserModel();
      newUser.imageUrl = imageUrl;

      const newEntity = await this.userRepository.updateEntityAsync(
        oldUser,
        newUser,
      );
      return await this.userRepository.update(command.userId, newEntity);
    } catch (error) {
      throw error;
    }
  }
}
