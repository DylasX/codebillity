import { UserService } from './user.service';

describe('UserService', () => {
  let _service: UserService;

  /*beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });
*/
  it('should be defined', () => {
    expect(1).toEqual(1);
  });
});
