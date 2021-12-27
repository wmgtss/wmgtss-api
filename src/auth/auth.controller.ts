import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { LocalAuthGuard } from './strategy/local/local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Req() req, @Res() res) {
    const loginUserDto: LoginUserDto = req.body;
    const token = await this.authService.login({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
    return res
      .cookie('access_token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send(req.user);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res) {
    const { email, password, name } = createUserDto;

    if (!email || !password || !name)
      throw new BadRequestException('Bad request');

    const { user, token } = await this.authService.signUp({
      email,
      password,
      name,
    });
    res
      .cookie('access_token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .status(201)
      .send({
        user,
        pwned: createUserDto.pwned,
      });
    console.log(createUserDto.pwned);
  }
}
