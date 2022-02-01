import { Connection, ViewEntity, ViewColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
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
      .from(Topic, 'topic')
      .leftJoin(User, 'user', 'user.id = topic.authorId')
      .orderBy('topic.createdOn', 'ASC'),
})
export class AuthorTopic {
  @ViewColumn()
  id: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  description: string;

  @ViewColumn()
  updatedOn: Date;

  @ViewColumn()
  authorName: string;
}
