import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class IdSearchUser implements PipeTransform {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    try {
      await this.userRepository.findOneOrFail({ where: { id: value } });
    } catch (err) {
      throw new NotFoundException('User not found');
    }
    return value;
  }
}
