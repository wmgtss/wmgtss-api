import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return 'Hello from the User service!';
  }
}
