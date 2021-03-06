import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  // Create the new user, and return a JWT
  async signUp(createUserDto: SignupDto) {
    const user: any = await this.usersService.create(createUserDto);
    return { user, token: this.jwtService.sign({ sub: user.id }) };
  }

  // Validate the email and password, and return a JWT
  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.validateUser(loginUserDto);
    return this.jwtService.sign({ sub: user.id });
  }

  // Used during login - get the user from the database and compare passwords
  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findForLogin(email);

    // If the password is valid, remove the password from the response and send the user
    if (user && (await user.validatePassword(password))) {
      delete user.password;
      return user;
    }

    // Otherwise, throw a 401 Unauthorized
    throw new UnauthorizedException();
  }
}
