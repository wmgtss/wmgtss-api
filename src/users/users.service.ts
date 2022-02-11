import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import { PublicUserDto } from './dto/user.public.dto';
import { isPasswordPwned } from 'src/util/pwned';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    return await this.userRepo.findOne({ id });
  }

  async findPublicById(id: string): Promise<PublicUserDto> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select('user.id')
      .addSelect('user.name')
      .addSelect('user.createdOn')
      .where('id = :id', { id })
      .getOne();
    if (user) return user;
    throw new NotFoundException();
  }

  async findForLogin(email: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  async create(createUserDto: SignupDto): Promise<User> {
    const existing = await this.userRepo.findOne({
      email: createUserDto.email,
    });
    if (existing) throw new BadRequestException('User already exists');

    const user = this.userRepo.create(createUserDto);
    await user.save();

    delete user.password;
    return user;
  }

  async changePassword(id: string, plainPassword: string): Promise<number> {
    const password = await bcrypt.hash(plainPassword, 10);
    this.userRepo
      .createQueryBuilder('user')
      .update()
      .set({ password })
      .where('id = :id', { id })
      .execute();
    return await isPasswordPwned(plainPassword);
  }

  async deleteById(id: string): Promise<string> {
    await this.userRepo.delete({ id });
    return id;
  }
}
