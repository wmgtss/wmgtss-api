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
import { isPasswordPwned } from '../util/pwned';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Get the details of the user with the given ID
  // This is missing some validation
  async findById(id: string): Promise<User> {
    return await this.userRepo.findOne({ id });
  }

  // Get the details for a user with the given ID, excluding the email address
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

  // The password column is not returned by SELECT by default
  // This function retrieves the user with the password for comparison for login
  async findForLogin(email: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  // Create a user with the given email and password
  async create(createUserDto: SignupDto): Promise<User> {
    // Check if the user exists - if it does, throw a 400 Bad Request
    const existing = await this.userRepo.findOne({
      email: createUserDto.email,
    });
    if (existing) throw new BadRequestException('User already exists');

    // Create the user and save to the database
    const user = this.userRepo.create(createUserDto);
    await user.save();

    // Remove the password from the response
    delete user.password;
    return user;
  }

  // Update the password for the user with the given ID
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

  // Delete a user with the given ID
  // This feature is not yet implemented
  async deleteById(id: string): Promise<string> {
    await this.userRepo.delete({ id });
    return id;
  }
}
