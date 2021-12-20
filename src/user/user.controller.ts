import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Logger,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { createUser, getAllUsers } from './openapi/user.response';
import { IdSearchUser } from './pipes/id-search.pipe';
import { Roles } from '../permissions/roles.decorator';
import RoleEnum from './enums/role.enum';
import { BypassAuth } from 'src/auth/bypass-auth.decorator';

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
    const newUser = await this.userService.create(createUserDto);
    return { result: newUser, message: 'User created' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(TransformInterceptor)
  @ApiResponse(getAllUsers)
  @ApiOperation({ summary: 'Find all users' })
  @Roles(RoleEnum.Admin)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return { result: users, message: 'Users retrieved' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user' })
  @BypassAuth()
  @UseInterceptors(TransformInterceptor)
  async findOne(@Param('id', ParseIntPipe, IdSearchUser) id: number) {
    const user = await this.userService.findOne(id);
    return { result: user, message: 'Users retrieved' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @UseInterceptors(TransformInterceptor)
  async update(
    @Param('id', ParseIntPipe, IdSearchUser) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const [user] = await this.userService.update(id, updateUserDto);
    return { result: user, message: 'User updated' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @UseInterceptors(TransformInterceptor)
  async remove(@Param('id', ParseIntPipe, IdSearchUser) id: number) {
    const deleted = await this.userService.remove(id);
    return { result: !!deleted.affected, message: 'User deleted' };
  }
}
