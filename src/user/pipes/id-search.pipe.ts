import { UserRepository } from '../repository/user.repository';
import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdSearchUser implements PipeTransform {
  constructor(
    @InjectRepository(UserRepository)
    public userRepository: Repository<UserRepository>,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      await this.userRepository.findOneOrFail(value);
    } catch (err) {
      throw new NotFoundException('User not found');
    }
    return value;
  }
}
