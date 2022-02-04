import { User } from '../users/entity/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Topic } from '../topics/entity/topic.entity';
import { AuthorTopic } from '../topics/entity/authourTopic.view';
import { Post } from '../posts/entity/post.entity';
import { AuthorPost } from '../posts/entity/authorPost.view';

export const dbConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'app_user',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'wmgtss',
  synchronize: true,
  entities: [User, Topic, AuthorTopic, Post, AuthorPost],
  logging: false,
  logger: 'advanced-console',
});

export default dbConfig();
