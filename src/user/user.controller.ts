import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  Logger,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { CustomHttpException } from '../commons/exceptions/customHttp.exception';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { createUser, getAllUsers } from './openapi/user.response';

@Controller('user')
@ApiTags('User')
export class UserController {
  private readonly log = new Logger('User');

  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  @ApiResponse(createUser)
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      return { result: newUser, message: 'User created' };
    } catch (error) {
      this.log.error(error);
      throw new CustomHttpException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiResponse(getAllUsers)
  @ApiOperation({ summary: 'Find all users' })
  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { result: users, message: 'Users retrieved' };
    } catch (error) {
      throw new CustomHttpException(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return { result: {}, message: 'User not found', code: 404 };
      }
      return { result: user, message: 'Users retrieved' };
    } catch (error) {
      throw new CustomHttpException(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
