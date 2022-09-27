import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import RoleEnum from './role/enums/role.enum';
import { UserCreation } from './types/user.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(userPayload: UserCreation) {
    const exist = await this.findByEmail(userPayload.email);
    if (exist) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }
    const defaultRole = await this.roleRepository.findOneBy({
      name: RoleEnum.User,
    });
    if (defaultRole) userPayload.roles = Promise.resolve([defaultRole]);
    const user: User = new User(userPayload);
    // cant use user.save because there is a bug in typeorm returning all columns
    return user.save();
  }

  findAll() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
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
      relations: ['roles'],
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
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.softDelete({ id });
  }
}
