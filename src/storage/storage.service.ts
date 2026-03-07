import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { Readable } from 'node:stream';

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      endpoint: env.MINIO_HOST + ':' + env.MINIO_PORT,
      region: 'us-east-1',
      credentials: {
        accessKeyId: env.MINIO_ROOT_USER,
        secretAccessKey: env.MINIO_ROOT_PASSWORD,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Buffer, key: string, mimeType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.MINIO_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );
  }

  async deleteFile(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: env.MINIO_BUCKET_NAME,
        Key: key,
      }),
    );
  }

  async downloadFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: env.MINIO_BUCKET_NAME,
      Key: key,
    });
    const response = await this.client.send(command);
    const stream = response.Body as Readable;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }
}
