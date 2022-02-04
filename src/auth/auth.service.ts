import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: SignupDto) {
    const user: any = await this.usersService.create(createUserDto);
    return { user, token: this.jwtService.sign({ sub: user.id }) };
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.validateUser(loginUserDto);
    return this.jwtService.sign({ sub: user.id });
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findForLogin(email);
    if (user && (await user.validatePassword(password))) {
      delete user.password;
      return user;
    }
    throw new UnauthorizedException();
  }
}
