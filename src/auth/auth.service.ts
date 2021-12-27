import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.user.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user: any = await this.userService.create(createUserDto);
    return { user, token: this.jwtService.sign({ sub: user.id }) };
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.validateUser(loginUserDto);
    return this.jwtService.sign({ sub: user.id });
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserDto> {
    const { email, password } = loginUserDto;
    const user = await this.userService.findForLogin(email);
    if (user && (await user.validatePassword(password))) {
      delete user.password;
      return user;
    }
    throw new UnauthorizedException();
  }
}
