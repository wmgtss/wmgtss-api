import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dbConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'app_user',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'wmgtss',
  synchronize: true,
});

export default dbConfig();