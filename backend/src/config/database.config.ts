import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from '../users/user.model';

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'casadinha',
  password: process.env.DB_PASSWORD || 'casadinha123',
  database: process.env.DB_DATABASE || 'casadinha_db',
  models: [User],
  autoLoadModels: true,
  synchronize: true, // Em produção, use migrations
  logging: false,
});
