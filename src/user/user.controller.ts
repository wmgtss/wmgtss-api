import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Resources')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getUser();
  }
}
