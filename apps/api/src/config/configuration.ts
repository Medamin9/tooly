export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  databaseUrl: string;
  paymentFulfillmentMode: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '4000', 10),
  apiPrefix: process.env.API_GLOBAL_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  paymentFulfillmentMode: process.env.PAYMENT_FULFILLMENT_MODE || 'offline_transfer',
  jwtSecret: process.env.JWT_SECRET || 'tooly_super_secret_jwt_key_min_32_chars_dev_only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
});
