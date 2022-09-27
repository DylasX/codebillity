import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from './entities/role.entity';
import RoleEnum from './enums/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addRoleAdminToUser(userId: number) {
    const role = await this.roleRepository.findOneByOrFail({
      name: RoleEnum.Admin,
    });
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!(await user.getRoles()).includes(RoleEnum.Admin)) {
      let userRoles = await user.roles;
      userRoles = [...userRoles, role];
      user.roles = Promise.resolve(userRoles);
      await user.save();
    }
    return true;
  }
}
