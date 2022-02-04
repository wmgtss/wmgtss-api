import { Injectable } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/post.create.dto';
import { User } from '../users/entity/user.entity';
import { AuthorPost } from './entity/authorPost.view';

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
}
