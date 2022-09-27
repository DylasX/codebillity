import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './user/role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './permissions/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import * as redisStore from 'cache-manager-redis-store';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { User } from './user/entities/user.entity';
import AdminJS, { CurrentAdmin } from 'adminjs';
import RoleEnum from './user/role/enums/role.enum';
import { Role } from './user/role/entities/role.entity';

AdminJS.registerAdapter({ Database, Resource });
//TODO: enable soft delete
// AdminJS.ACTIONS.delete.handler = async (request, response, data) => {
//   if (!request.params.recordId || !record) {
//     throw new NotFoundError(
//       ['You have to pass "recordId" to Delete Action'].join('\n'),
//       'Action#handler',
//     );
//   }
// };

//TODO: implement express-session with redis
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['./.envs/.local/.node', './.envs/.production/.node'],
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UserModule,
    RoleModule,
    AuthModule,
    //TODO: This should be in a separated project with a string connection typeorm
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [User, Role],
        },
        auth: {
          authenticate: async (email, password) => {
            const userModel = User.getRepository();
            const user = await userModel.findOne({
              select: ['id', 'email', 'password'],
              where: { email },
            });
            const isValid = await user.validatePassword(password);
            const roles = await user.getRoles();
            if (!isValid || !roles.some((role) => role === RoleEnum.Admin))
              return;
            return user as any as CurrentAdmin;
          },
          cookieName: 'adminBro',
          cookiePassword: 'adminBro',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
