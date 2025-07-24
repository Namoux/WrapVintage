import dotenv from "dotenv";
dotenv.config(); // charge le .env dès l'import

export const SECRETKEY = process.env.SECRETKEY;
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const NODE_ENV = process.env.NODE_ENV;