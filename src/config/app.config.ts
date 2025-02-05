import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  jwt: {
    secret: {
      name: process.env.JWT_SECRET_NAME,
      key: process.env.JWT_SECRET_KEY,
    },
    expirationDays: process.env.JWT_EXP_DAYS,
  },
  storage: {
    connection: {
      string: process.env.BLOB_STORAGE_CONNECTION_STRING,
    },
    container: {
      name: process.env.BLOB_STORAGE_CONTAINER_NAME,
    },
  },
}));
