import { ApiProperty } from '@nestjs/swagger';
import { Connection, ViewEntity, ViewColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Post } from './post.entity';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('post.id', 'id')
      .addSelect('post.title', 'title')
      .addSelect('post.content', 'content')
      .addSelect('post.topicId', 'topicId')
      .addSelect('post.createdOn', 'createdOn')
      .addSelect('user.name', 'authorName')
      .addSelect('user.id', 'authorId')
      .from(Post, 'post')
      .leftJoin(User, 'user', 'user.id = post.authorId')
      .orderBy('post.createdOn', 'DESC'),
})
export class AuthorPost {
  @ApiProperty()
  @ViewColumn()
  id: string;

  @ApiProperty()
  @ViewColumn()
  title: string;

  @ApiProperty()
  @ViewColumn()
  content: string;

  @ApiProperty()
  @ViewColumn()
  topicId: string;

  @ApiProperty()
  @ViewColumn()
  createdOn: Date;

  @ApiProperty()
  @ViewColumn()
  authorName: string;

  @ApiProperty()
  @ViewColumn()
  authorId: string;
}
