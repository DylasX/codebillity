import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpCode,
  UseInterceptors,
  Logger,
  Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './auth.dto';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { decrypt, encrypt } from '../commons/crypto/crypter';
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
  @HttpCode(200)
  @Post('login')
  async login(@Request() request, @Res() res) {
    const user = request.user;
    delete user.password;
    const { access_token } = await this.authService.createToken(request.user);
    const ip = request.ip;
    const cryptedToken = encrypt(access_token, {
      key: `SecretHashPassword${ip}ToCookie`,
    });
    res.cookie('user', cryptedToken, {
      maxAge: 900000,
      httpOnly: true,
      secure: true,
    });
    return res.send({
      statusCode: 200,
      message: 'User login',
    });
  }

  @Get('profile')
  getProfile(@Request() req) {
    const ip = req.ip;
    console.log(req.cookies);
    console.log(
      decrypt(req.cookies.user, { key: `SecretHashPassword${ip}ToCookie` }),
    );
    return req.user;
  }
}
