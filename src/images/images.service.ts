import { Injectable, Inject } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import {
  S3Client,
  // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'node:path';
import * as dayjs from 'dayjs';
import configuration from 'src/config/configuration';

@Injectable()
export class ImagesService {
  s3client: S3Client | null = null;
  // accessKey: '0Jsp5xiDJxGqAIQLCQlj',
  // secretKey: 'RqlujYfEbIPSmGrIpWgMq2q29rnN8L6knygAghvH',

  constructor(
    @Inject('IMAGE_REPOSITORY')
    private imageRepository: Repository<Image>,
  ) {
    this.s3client = new S3Client({
      region: configuration().storage.region,
      endpoint: configuration().storage.endpoint,
      forcePathStyle: configuration().storage.forcePathStyle,
      credentials: {
        accessKeyId: configuration().storage.accessKeyId,
        secretAccessKey: configuration().storage.secretAccessKey,
      },
    });
  }

  async create(createImageDto: CreateImageDto, file: Express.Multer.File) {
    const fileName =
      path.parse(file.originalname).name +
      dayjs().format('_YYYYMMDDHHmmss') +
      path.parse(file.originalname).ext;
    const bucketName = configuration().storage.bucketName;
    const objectKey = 'images/' + fileName;
    const imagePath = '/' + bucketName + '/' + objectKey;

    // アップロードファイル読み込み
    const readStream = fs.createReadStream(file.path);
    try {
      // Object Strage へ書き込み
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: readStream,
        ContentType: file.mimetype,
      });
      await this.s3client.send(command);
    } catch (error) {
      throw error;
    } finally {
      readStream.close();

      // DBへデータ登録
      createImageDto.bucket = bucketName;
      createImageDto.objectKey = objectKey;
      createImageDto.path = imagePath;
      return await this.imageRepository.save(createImageDto);
    }
  }

  async findAll() {
    return await this.imageRepository.find();
  }

  async findOne(id: number) {
    return await this.imageRepository.findOneByOrFail({ id: id });
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const imageData = await this.imageRepository.findOneByOrFail({ id: id });
    // 以下のデータ項目は更新しない。
    updateImageDto.bucket = imageData.bucket;
    updateImageDto.objectKey = imageData.objectKey;
    updateImageDto.path = imageData.path;

    // update the target DB data.
    return this.imageRepository.update(id, updateImageDto);
  }

  async remove(id: number) {
    // remove the target object
    const imageData = await this.imageRepository.findOneByOrFail({ id: id });
    const command3 = new DeleteObjectCommand({
      Bucket: imageData.bucket,
      Key: imageData.objectKey,
    });
    await this.s3client.send(command3);

    // softdelete the target DB data.
    return this.imageRepository.softDelete(id);
  }

  async listS3() {
    // list objects
    const command = new ListObjectsV2Command({
      Bucket: 'webapp4',
    });
    const result = await this.s3client.send(command);
    // console.log(result);
    return result.Contents;
  }
}
