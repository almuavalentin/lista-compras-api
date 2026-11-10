import 'dotenv/config';
import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Falta la variable DATABASE_URL en el archivo .env');
}

// DB_SSL=true es necesario para bases en la nube (Neon, Supabase, Render, etc.)
const useSsl = process.env.DB_SSL === 'true';

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
});
