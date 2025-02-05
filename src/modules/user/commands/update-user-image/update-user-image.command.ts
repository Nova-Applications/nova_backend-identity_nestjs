import { FileUpload } from '../../../../shared/storage/blob-storage.client';

export class UpdateUserImageCommand {
  constructor(
    public readonly userId: string,
    public readonly file: FileUpload,
  ) {}
}
