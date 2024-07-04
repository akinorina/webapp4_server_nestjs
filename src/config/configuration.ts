import 'dotenv/config';

export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'not named yet',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    cors: process.env.APP_CORS === 'true' || false,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 3306,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth:
      process.env.SMTP_SECURE === 'true'
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : null,
  },
});
