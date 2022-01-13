import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from '../auth/dto/create.user.dto';
import { PublicUserDto } from './dto/public.user.dto';
import { isPasswordPwned } from 'src/util/pwned';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserDto> {
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

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
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
