import { registerAs } from '@nestjs/config';

export default registerAs('environment', () => ({
  production: process.env.NODE_ENV === 'production',
  port: process.env.PORT,
}));
