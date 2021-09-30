import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { HttpException, Logger } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly log = new Logger('User');

  async createUser(payload: CreateUserDto): Promise<Partial<User>> {
    const newUser: User = this.create({ ...payload });
    await this.save(newUser);
    return {
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
    };
  }

  async updateUser(
    id: number,
    payload: UpdateUserDto,
  ): Promise<Partial<User[]>> {
    const cryptedPassword = await bcrypt.hash(payload.password, 10);
    const userRow = await this.createQueryBuilder()
      .update(User, { ...payload, password: cryptedPassword })
      .where('id = :id', { id })
      .returning('name, last_name, email')
      .updateEntity(true)
      .execute();

    return userRow.raw;
  }
}
