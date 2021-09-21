import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(payload: CreateUserDto): Promise<Partial<User>> {
    try {
      const email = payload.email;

      const existUser = await this.findOne({
        where: [{ email }],
      });

      if (existUser) {
        //TODO: replace that
        throw new Error('Ya existe');
      }

      const newUser: User = this.create({ ...payload });

      await this.save(newUser);

      return {
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
      };
    } catch (error) {
      //TODO: create logger and exceptions
      console.error(error);
    }
  }
}
