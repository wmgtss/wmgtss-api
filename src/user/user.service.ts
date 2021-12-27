import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findByOptions(options: FindOneOptions<User>): Promise<UserDto> {
    return await this.userRepo.findOne(options);
  }

  async findForLogin(email: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  async findAll(): Promise<UserDto[]> {
    return await this.userRepo.createQueryBuilder().getMany();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = this.userRepo.create(createUserDto);
    await user.save();

    return user;
  }
}
