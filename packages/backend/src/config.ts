import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface Config {
  port: number;
  jwtSecret: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
}

const config: Config = {
  port: +process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  dbHost: process.env.DB_HOST,
  dbPort: +process.env.DB_PORT,
  dbName: process.env.DB_NAME,
};

export default config;
