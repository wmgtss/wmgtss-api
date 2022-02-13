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

  // Creates a post with the ID of the given user as the authorId
  async createPost(post: CreatePostDto, user: User): Promise<Post> {
    return this.postRepository
      .create({
        ...post,
        authorId: user.id,
      })
      .save();
  }

  // Gets all the posts belonging to the topic with the given ID
  async getPostsForTopic(topicId: string): Promise<AuthorPost[]> {
    return await this.authorPostRepository.find({ topicId });
  }

  // Gets the details of a post with the given ID
  async getPostById(id: string): Promise<AuthorPost> {
    return await this.authorPostRepository.findOne({ id });
  }

  // Delete a post with the given ID
  async deletePostById(id: string, user: User) {
    // Get the post if it already exists, else throw a 404 Not Found
    const existing = await this.authorPostRepository.findOne({ id });
    if (!existing) throw new NotFoundException();

    // Only delete if the user is an admin, or the author
    if (existing.authorId === user.id || user.roles.includes(Role.Admin)) {
      return this.postRepository.delete({ id });
    } else {
      throw new UnauthorizedException();
    }
  }
}
