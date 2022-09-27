import {
  Controller,
  Post,
  UseInterceptors,
  Logger,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BypassAuth } from 'src/auth/bypass-auth.decorator';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';
import { IdSearchUser } from '../pipes/id-search.pipe';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  private readonly log = new Logger('Role');

  constructor(private readonly roleService: RoleService) {}

  @Post(':userId')
  @UseInterceptors(TransformInterceptor)
  @BypassAuth()
  @ApiOperation({ summary: 'Add Role Admin to User' })
  async create(@Param('userId', ParseIntPipe, IdSearchUser) userId: number) {
    const newRoleUser = await this.roleService.addRoleAdminToUser(userId);
    return { result: newRoleUser, message: 'User updated' };
  }
}
