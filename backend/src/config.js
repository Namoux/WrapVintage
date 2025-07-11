import dotenv from "dotenv";
dotenv.config(); // charge le .env dès l'import

export const SECRETKEY = process.env.SECRETKEY;
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
