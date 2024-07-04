import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { createTransport, Transporter } from 'nodemailer';
import * as nunjucks from 'nunjucks';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

nunjucks.configure('views', { autoescape: true });

@Injectable()
export class ContactsService {
  smtpConfig: SmtpConfig;
  transporter: Transporter;

  constructor(
    @Inject('CONTACT_REPOSITORY')
    private contactRepository: Repository<Contact>,
    private configService: ConfigService,
  ) {
    this.smtpConfig = this.configService.get<SmtpConfig>('smtp');
    this.transporter = createTransport(this.smtpConfig);
  }

  async create(createContactDto: CreateContactDto) {
    return await this.contactRepository.save(createContactDto);
  }

  async findAll() {
    return this.contactRepository.find();
  }

  async findOne(id: number) {
    return this.contactRepository.findOneByOrFail({ id: id });
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    return this.contactRepository.update(id, updateContactDto);
  }

  async remove(id: number) {
    return this.contactRepository.softDelete(id);
  }

  /**
   * テストメールを送信
   * @returns {}
   */
  async sendTestMail() {
    // send a mail.
    const info = await this.transporter.sendMail({
      from: '"foo" <foo@gmail.com>',
      to: '"bar" <bar@gmail.com>',
      subject: 'Hello ✔',
      text: 'Hello world?',
      html: '<b>Hello world?</b>',
    });
    console.log('Message sent', info.messageId);

    return { name: 'send_test_mail', status: 'success' };
  }
}
