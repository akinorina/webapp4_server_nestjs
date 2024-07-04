import { Injectable, Inject } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('CONTACT_REPOSITORY')
    private contactRepository: Repository<Contact>,
  ) {}

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
}
