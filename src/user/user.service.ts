import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.entity';
import RoleEnum from './enums/role.enum';
import { UserRepository } from './repository/user.repository';
import { UserCreation } from './types/user.types';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly _logger: Logger,
  ) {}

  async create(userPayload: UserCreation) {
    const exist = await this.findByEmail(userPayload.email);
    if (exist) {
      throw new HttpException('Email already exist', HttpStatus.CONFLICT);
    }
    const defaultRole = await this.roleRepository.findOne({
      name: RoleEnum.User,
    });
    if (defaultRole) userPayload.roles = [defaultRole];
    return this.userRepository.createUser(userPayload);
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
    return this.userRepository.updateUser(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.softDelete({ id });
  }
}
