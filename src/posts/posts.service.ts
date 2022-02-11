import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/post.create.dto';
import { User } from '../users/entity/user.entity';
import { AuthorPost } from './entity/authorPost.view';
import { Role } from '../role/role.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(AuthorPost)
    private readonly authorPostRepository: Repository<AuthorPost>,
  ) {}

  async createPost(post: CreatePostDto, user: User): Promise<Post> {
    return this.postRepository
      .create({
        ...post,
        authorId: user.id,
      })
      .save();
  }

  async getPostsForTopic(topicId: string): Promise<AuthorPost[]> {
    return await this.authorPostRepository.find({ topicId });
  }

  async getPostById(id: string): Promise<AuthorPost> {
    return await this.authorPostRepository.findOne({ id });
  }

  async deletePostById(id: string, user: User) {
    const existing = await this.postRepository.findOne({ id });
    if (!existing) throw new NotFoundException();
    if (existing.authorId === user.id || user.roles.includes(Role.Admin)) {
      return this.postRepository.delete({ id });
    } else {
      throw new UnauthorizedException();
    }
  }
}
