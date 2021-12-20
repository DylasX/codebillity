import { CreateUserDto } from '../dto/create-user.dto';
// import { User } from '../entities/user.entity';

export class UserRepository {
  createUser(_payload: CreateUserDto): any {
    return {
      name: 'name',
      lastName: 'name',
      email: 'name',
    };
  }
}
