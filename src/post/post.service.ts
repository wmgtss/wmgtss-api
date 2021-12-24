import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  getPost() {
    return 'Hello from the Post service!';
  }
}
