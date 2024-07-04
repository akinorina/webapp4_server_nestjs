import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Application "' + configuration().app.name + '" is running.';
  }
}
