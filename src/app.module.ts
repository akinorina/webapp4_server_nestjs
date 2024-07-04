import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ContactsModule } from './contacts/contacts.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    UsersModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
