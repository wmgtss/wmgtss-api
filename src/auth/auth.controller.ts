import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginUserDto } from './dto/login.dto';
import { LocalAuthGuard } from './strategy/local/local.guard';
import { SignupResponseDto } from './dto/signup.response.dto';
import { User } from '../users/entity/user.entity';

/**
 * Auth Controller
 * Accepts requests on the /auth resource
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  cookieSettings = {
    domain: this.configService.get('REACT_DOMAIN'),
    secure: this.configService.get('HTTPS'),
    httpOnly: true,
  };

  // POST: /auth/login
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiBody({ type: LoginUserDto })
  async login(@Req() req, @Res() res) {
    const loginUserDto: LoginUserDto = req.body;
    const token = await this.authService.login({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
    return res
      .cookie('access_token', token, {
        ...this.cookieSettings,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .status(200)
      .send(req.user);
  }

  // POST: /auth/logout
  @Post('logout')
  @ApiOkResponse()
  async logout(@Req() _req, @Res() res) {
    return res
      .cookie('access_token', null, {
        ...this.cookieSettings,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .status(200)
      .send('Logged out');
  }

  // POST: /auth/signup
  @Post('signup')
  @ApiOkResponse({ type: SignupResponseDto })
  @ApiBody({ type: SignupDto })
  async signUp(@Req() req, @Res() res) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) throw new BadRequestException();

    const { user, token } = await this.authService.signUp({
      email,
      password,
      name,
    });
    res
      .cookie('access_token', token, {
        ...this.cookieSettings,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .status(201)
      .send({
        user,
        pwned: req.pwned,
      });
  }
}
