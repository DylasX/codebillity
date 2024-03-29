import { Module } from '@nestjs/common';
import {
  CacheManagerOptions,
  CacheModule,
  CacheOptions,
  CacheStore,
} from '@nestjs/cache-manager';
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

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<CacheOptions<CacheManagerOptions & Record<string, any>>> => ({
        store: redisStore as unknown as CacheStore,
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
