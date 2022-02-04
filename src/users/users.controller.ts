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
import { PublicUserDto } from './dto/user.public.dto';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async getCurrent(@Req() req) {
    return req.user;
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async updateUser(@Req() req) {
    const pwned = await this.usersService.changePassword(
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
    const user = await this.usersService.findPublicById(id);
    return user;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiUnauthorizedResponse({ description: 'Not signed in' })
  async deleteCurrent(@Req() req) {
    const id = await this.usersService.deleteById(req.user.id);
    return { id };
  }
}
