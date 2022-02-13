import { dbConfig } from './database';

export default () => ({
  PORT: process.env.PORT || '5000',
  HTTPS: !!process.env.HTTPS,
  DATABASE: dbConfig(),
  REACT_DOMAIN: process.env.REACT_DOMAIN || 'wmgtss.com',
  REACT_URL: process.env.REACT_URL || 'https://wmgtss.com',
});
