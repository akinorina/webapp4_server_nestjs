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
    const endpoint = configuration().storage.endpoint;
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
      createImageDto.objectKey = objectKey;
      createImageDto.path = imagePath;
      createImageDto.url = endpoint + imagePath;
      return await this.imageRepository.save(createImageDto);
    }
  }

  async findAll() {
    // return `This action returns all images`;
    return await this.imageRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    // // remove object --- Bucket:'webapp4' / key:'IMG_5436s.jpg'
    // const command3 = new DeleteObjectCommand({
    //   Bucket: 'webapp4',
    //   Key: 'IMG_5436s.jpg',
    // });
    // const result3 = await this.s3client.send(command3);
    // console.log(result3);
    return `This action removes a #${id} image`;
  }

  async cmd() {
    // list objects
    const command = new ListObjectsV2Command({
      Bucket: 'webapp4',
    });
    const result = await this.s3client.send(command);
    // console.log(result);
    return result.Contents;
  }
}
