import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategy/jwt/jwt.guard';
import { PublicUserDto } from './dto/public.user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async getCurrent(@Req() req) {
    return req.user;
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async updateUser(@Req() req) {
    const pwned = await this.userService.changePassword(
      req.user.id,
      req.body.password,
    );
    return { pwned };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findPublicById(id);
    return user;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async deleteCurrent(@Req() req) {
    const id = await this.userService.deleteById(req.user.id);
    return { id };
  }
}
