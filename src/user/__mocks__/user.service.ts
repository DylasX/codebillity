import { CreateUserDto } from '../dto/create-user.dto';

export class UserService {
  create(_createUserDto: CreateUserDto) {
    return {
      user: 'name',
    };
  }
}
