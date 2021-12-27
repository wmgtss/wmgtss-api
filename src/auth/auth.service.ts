import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login.user.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

const logger = new Logger();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.validateUser(loginUserDto);
    const payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDto> {
    const { email, password } = loginUserDto;
    const user = await this.userService.findForLogin(email);
    if (await user.validatePassword(password)) return user;
    throw new UnauthorizedException();
  }
}
