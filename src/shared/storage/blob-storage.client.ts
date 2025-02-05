import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

export class FileUpload {
  name: string;
  type: string;
  file: any;
  length: number;
}

export class BlobStorageClient {
  private readonly blobClient: BlobServiceClient;
  private readonly containerClient: ContainerClient;

  constructor(private configService: ConfigService) {
    this.blobClient = BlobServiceClient.fromConnectionString(
      this.configService.get<string>('app.storage.connection.string'),
    );
    this.containerClient = this.blobClient.getContainerClient(
      this.configService.get<string>('app.storage.container.name'),
    );
  }

  async uploadFile(fileInfo: FileUpload): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(
      `${fileInfo.name}.${fileInfo.type}`,
    );
    await blockBlobClient.upload(fileInfo.file, fileInfo.length);
    return blockBlobClient.url;
  }

  async delete(name: string): Promise<boolean> {
    await this.containerClient.deleteBlob(name);
    return true;
  }
}
