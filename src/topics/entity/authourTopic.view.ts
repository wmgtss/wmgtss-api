import { ApiProperty } from '@nestjs/swagger';
import { Connection, ViewEntity, ViewColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Topic } from './topic.entity';

@ViewEntity({
  expression: (connection: Connection) =>
    connection
      .createQueryBuilder()
      .select('topic.id', 'id')
      .addSelect('topic.name', 'name')
      .addSelect('topic.description', 'description')
      .addSelect('topic.updatedOn', 'updatedOn')
      .addSelect('user.name', 'authorName')
      .addSelect('user.id', 'authorId')
      .from(Topic, 'topic')
      .leftJoin(User, 'user', 'user.id = topic.authorId')
      .orderBy('topic.createdOn', 'ASC'),
})
export class AuthorTopic {
  @ApiProperty()
  @ViewColumn()
  id: string;

  @ApiProperty()
  @ViewColumn()
  name: string;

  @ApiProperty()
  @ViewColumn()
  description: string;

  @ApiProperty()
  @ViewColumn()
  updatedOn: Date;

  @ApiProperty()
  @ViewColumn()
  authorName: string;

  @ApiProperty()
  @ViewColumn()
  authorId: string;
}
