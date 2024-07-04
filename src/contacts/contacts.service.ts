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

  /**
   * お問い合わせ登録処理
   * @param createContactDto お問い合わせデータ
   * @returns { status: 'success' }
   */
  async registNewContact(createContactDto: CreateContactDto) {
    // お問い合わせデータをDB登録
    const res = await this.contactRepository.save(createContactDto);

    // お問い合わせデータを管理者へ送信
    const toAdminTxt = nunjucks.render('contact/to-admin.txt.njk', res);
    const toAdminHtml = nunjucks.render('contact/to-admin.html.njk', res);
    await this.transporter.sendMail({
      from: '"foo" <info@gmai.com>',
      to: '"bar" <info@gmai.com>',
      subject: 'お問い合わせ',
      text: toAdminTxt,
      html: toAdminHtml,
    });

    // お問い合わせデータをお問い合わせ者へ送信
    const toCustomerTxt = nunjucks.render('contact/to-customer.txt.njk', res);
    const toCustomerHtml = nunjucks.render('contact/to-customer.html.njk', res);
    await this.transporter.sendMail({
      from: '"foo" <info@gmai.com>',
      to: '"' + res.name + '" <' + res.email + '>',
      subject: 'お問い合わせいただきありがとうございます',
      text: toCustomerTxt,
      html: toCustomerHtml,
    });

    return { name: 'regist_new_contact', status: 'success' };
  }
}
