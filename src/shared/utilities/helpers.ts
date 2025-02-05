import { BadRequestException } from '@nestjs/common';
import { FileUpload } from '../storage/blob-storage.client';
import { Guid } from 'guid-typescript';
import { Request } from 'express';

export function getFileFromRequest(request: Request): FileUpload {
  const file = request['file'];
  if (!file) {
    throw new BadRequestException('File is required');
  }

  const result = new FileUpload();
  result.name = Guid.create().toString();
  result.file = file.buffer;
  result.length = file.size;
  result.type = 'webp';

  return result;
}
