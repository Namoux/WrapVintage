import express from "express";
import { UserModel } from "../models/user.model.js";
import { loginUser, signupUser, getCurrentUser, logoutUser } from "../controllers/auth.controller.js";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";


/**
 * Définit les routes d'authentification (login et signup)
 * @param {object} connection - Instance de connexion à la base de données
 * @returns {import('express').Router} - Router Express configuré
 */
const authRoutes = (connection, baseUrl) => {
    const router = express.Router();
    const userModel = new UserModel(connection);
    const productModel = new ProductModel(connection, baseUrl);
    const cartModel = new CartModel(connection, productModel);

    router.post("/login", loginUser(userModel));
    router.post("/signup", signupUser(userModel, cartModel));
    router.get("/me", getCurrentUser(userModel));
    router.post("/logout", logoutUser());

    return router;
};

export default authRoutes;
