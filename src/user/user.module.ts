import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformInterceptor } from './../commons/interceptors/transform.interceptor';
import { IdSearchUser } from './pipes/id-search.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService, TransformInterceptor, IdSearchUser],
  exports: [UserService],
})
export class UserModule {}
