// import { createConnection } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config();

// export const initializeDatabase = async () => {
//   return createConnection({
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || '5432'),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: ['src/entities/**/*.ts'],
//   });
// };