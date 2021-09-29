import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Login and create a token' })
  @ApiProperty({
    name: 'password',
    required: true,
    description: 'user password',
    type: 'string',
    format: 'password',
  })
  @ApiProperty({
    writeOnly: true,
    name: 'email',
    required: true,
    description: 'user email',
    type: 'string',
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() request) {
    const user = request.user;
    delete user.password;
    const { access_token } = await this.authService.createToken(request.user);
    return {
      ...user,
      access_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
