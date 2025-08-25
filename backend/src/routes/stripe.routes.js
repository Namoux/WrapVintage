import express from 'express';
import { createCheckoutSession, stripeWebhook } from "../controllers/stripe.controller.js";
import { OrderModel } from '../models/order.model.js';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import { UserModel } from '../models/user.model.js';

const stripeRoutes = (connection, baseUrl) => {
    const router = express.Router();
    const productModel = new ProductModel(connection, baseUrl);
    const cartModel = new CartModel(connection, productModel);
    const orderModel = new OrderModel(connection);
    const userModel = new UserModel(connection);


    router.post("/create-checkout-session", express.json(), createCheckoutSession);
    // Route pour le webhook Stripe (attention : body en raw !)
    router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook(orderModel, cartModel, userModel));

    return router;
}


export default stripeRoutes;