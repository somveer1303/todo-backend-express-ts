import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { Readable } from 'stream';
import { cwd } from 'process';
import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import { config } from '@/utils/config.utils';

export interface UploadFileToS3 {
  localFilePath: string;
  s3FilePath: string;
  bucket: string;
}

const s3Client = new S3Client({
  region: config.aws.S3.region,
  credentials: {
    accessKeyId: config.aws.S3.accessKeyId,
    secretAccessKey: config.aws.S3.secretAccessKey,
  },
});

export const getFileStream = async (bucket: string, pathKey: string): Promise<any> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: pathKey,
  });
  const data: GetObjectCommandOutput = await s3Client.send(command);
  return data.Body;
};

const s3bucket = new AWS.S3({
  signatureVersion: config.aws.S3.signatureVersion,
  accessKeyId: config.aws.S3.accessKeyId,
  secretAccessKey: config.aws.S3.secretAccessKey,
  credentials: {
    accessKeyId: config.aws.S3.accessKeyId,
    secretAccessKey: config.aws.S3.secretAccessKey,
  },
  region: config.aws.S3.region,
});

export function generateFileName(extension = 'xlsx'): string {
  return v4() + '.' + extension;
}

export function uploadToS3FromDisk(file: UploadFileToS3): Promise<any> {
  const bucket = file.bucket;
  const readStream: Readable = fs.createReadStream(file.localFilePath);
  const params: AWS.S3.PutObjectRequest = {
    Bucket: `${bucket}/${file.s3FilePath}`,
    Key: generateFileName(),
    Body: readStream,
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, function (err: Error, data: AWS.S3.ManagedUpload.SendData) {
      readStream.destroy();
      fs.unlink(file.localFilePath, err => {
        if (err) {
          return reject(err);
        }
      });
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}

// TODO: get file extension from s3 object
export const downloadToDisk = (
  bucket: string,
  pathKey: string,
  location = `${path.resolve(cwd(), '../')}`,
  fileExtension = 'pdf',
) => {
  const object = s3bucket.getObject({ Bucket: bucket, Key: pathKey });
  const fileName = generateFileName(fileExtension);
  const localFilePath = `${location}/${fileName}`;
  const readStream = object.createReadStream();
  const writeStream = fs.createWriteStream(localFilePath);
  return new Promise((resolve, reject) => {
    readStream
      .pipe(writeStream)
      .on('error', error => {
        return reject(error);
      })
      .on('finish', () => {
        return resolve({
          ok: true,
          filePath: localFilePath,
        });
      });
  });
};
