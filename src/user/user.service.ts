import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Not } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const exist = await this.findByEmail(createUserDto.email);
    if (exist) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }
    return this.userRepository.createUser(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  findCredentialsLogin(email: string) {
    return this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const exist = await this.userRepository.findOne({
      where: { email: updateUserDto.email, id: Not(id) },
    });
    if (exist) {
      throw new HttpException('New email already exist', HttpStatus.CONFLICT);
    }
    //TODO: check changes before send it to update
    return this.userRepository.updateUser(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.softDelete({ id });
  }
}
