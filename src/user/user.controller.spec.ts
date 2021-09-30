import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './__mocks__/user.repository';
import { UserService } from './user.service';
import { TransformInterceptor } from '../commons/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdSearchUser } from './pipes/id-search.pipe';
jest.mock('./user.service.ts');
jest.mock('./pipes/id-search.pipe');

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: UserRepository },
        TransformInterceptor,
        JwtAuthGuard,
        IdSearchUser,
      ],
      imports: [],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
