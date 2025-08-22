import dotenv from "dotenv";
import Stripe from "stripe";

// dotenv.config({ path: "../.env" }); // charge le .env dès l'import

// Charge le .env local seulement si NODE_ENV n'est pas production
dotenv.config({ path: process.env.NODE_ENV !== "production" ? "../.env" : undefined });


export const SECRETKEY = process.env.SECRETKEY;
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const NODE_ENV = process.env.NODE_ENV;
export const CLIENT_URL = process.env.CLIENT_URL;
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
});