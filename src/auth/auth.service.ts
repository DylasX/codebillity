import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findCredentialsLogin(email);
    if (!user) {
      return null;
    }
    const validatedUser = await user.validatePassword(password);
    if (validatedUser) {
      return user;
    }

    return null;
  }

  async createToken(user: User) {
    const { id, email } = user;
    const roles = await user.getRoles(id);
    return {
      access_token: this.jwtService.sign({
        sub: id,
        email,
        roles,
      }),
    };
  }
}
