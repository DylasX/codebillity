import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../entities/role.entity';

export interface Roles {
  roles?: Role[];
}

export interface UserCreation extends CreateUserDto, Roles {}
