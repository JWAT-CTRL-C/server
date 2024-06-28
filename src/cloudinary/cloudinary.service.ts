import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configServer: ConfigService) {}
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
    username?: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder,
          overwrite: true,
          public_id:
            folder === 'users'
              ? username + '_avatar'
              : file.filename + '_' + randomBytes(8).toString('hex'),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(public_id: string) {
    return await v2.uploader.destroy(public_id);
  }
}
