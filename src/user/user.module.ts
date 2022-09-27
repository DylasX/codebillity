import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './../commons/interceptors/transform.interceptor';
import { IdSearchUser } from './pipes/id-search.pipe';
import { User } from './entities/user.entity';
import { Role } from './role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, TransformInterceptor, IdSearchUser],
  exports: [UserService],
})
export class UserModule {}
