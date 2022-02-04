import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entity/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorPost } from './entity/authorPost.view';

@Module({
  imports: [TypeOrmModule.forFeature([Post, AuthorPost])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
