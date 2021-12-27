import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategy/jwt/jwt.guard';
import { UserService } from './user.service';

@ApiTags('Resources')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() body) {
    this.userService.create({
      email: body.email,
      password: body.password,
      name: body.name,
    });
  }
}
