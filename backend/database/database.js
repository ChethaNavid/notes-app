import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE, 
  process.env.DATABASE_USER, 
  process.env.DATABASE_PASSWORD, 
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
  }
);

export default sequelize;