export default () => ({
  PORT: process.env.PORT || '3000',
  HTTPS: !!process.env.HTTPS,
  DATABASE: {
    URL: process.env.DATABASE_URL,
    USER: process.env.DATABASE_USER,
    NAME: process.env.DATABASE_NAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
  },
});
