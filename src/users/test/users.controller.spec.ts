import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../role/role.enum';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

const mockUser = {
  id: 'userid',
  email: 'foo@example.com',
  name: 'Test User',
  roles: [Role.User],
  createdOn: Date.now(),
};

const mockUsersService = {
  changePassword: jest.fn(() => {
    return 123;
  }),

  deleteById: jest.fn((id) => {
    return { id };
  }),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('gets current user', async () => {
    const req = {
      user: mockUser,
    };

    const res = await controller.getCurrent(req);
    expect(res).toEqual(req.user);
  });

  it('changes password', async () => {
    const res = await controller.updateUser({
      user: mockUser,
      body: { password: 'newpass' },
    });

    expect(res).toEqual({ pwned: expect.any(Number) });
  });

  it('deletes a user', async () => {
    const res = await controller.deleteCurrent({ user: mockUser });
    expect(res).toEqual({ id: mockUser.id });
  });
});
