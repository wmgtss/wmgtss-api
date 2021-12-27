import { dbConfig } from './database';

export default () => ({
  PORT: process.env.PORT || '3000',
  HTTPS: !!process.env.HTTPS,
  DATABASE: dbConfig(),
  JWT_SECRET: process.env.JWT_SECRET,
});
