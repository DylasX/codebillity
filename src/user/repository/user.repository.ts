import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserCreation } from '../types/user.types';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly log = new Logger('User');

  async createUser(payload: UserCreation): Promise<Partial<User>> {
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
    let cryptedPassword;
    let updateWithPassword = { ...payload };
    if (payload.password) {
      cryptedPassword = await bcrypt.hash(payload.password, 10);
      updateWithPassword = { ...payload, password: cryptedPassword };
    }

    const userRow = await this.createQueryBuilder()
      .update(User, updateWithPassword)
      .where('id = :id', { id })
      .returning('name, last_name, email')
      .updateEntity(true)
      .execute();

    return userRow.raw;
  }
}
