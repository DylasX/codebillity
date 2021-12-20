import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './auth.dto';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { Roles } from 'src/permissions/roles.decorator';
import RoleEnum from 'src/user/enums/role.enum';
import { BypassAuth } from './bypass-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly log = new Logger('Auth');

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Login and create a token' })
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  @UseInterceptors(TransformInterceptor)
  @Post('login')
  @BypassAuth()
  async login(@Request() request) {
    const user = request.user;
    delete user.password;
    const { access_token } = await this.authService.createToken(request.user);
    return { result: { ...user, access_token }, message: 'User logged' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @Roles(RoleEnum.Admin)
  getProfile(@Request() req) {
    return req.user;
  }
}
