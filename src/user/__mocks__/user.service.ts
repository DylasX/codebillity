import { CreateUserDto } from '../dto/create-user.dto';

export class UserService {
  create(createUserDto: CreateUserDto) {
    return {
      user: 'name',
    };
  }
}
