import express from "express";
import { UserModel } from "../models/user.model.js";
import { loginUser, signupUser } from "../controllers/auth.controller.js";

/**
 * Définit les routes d'authentification (login et signup)
 * @param {object} connection - Instance de connexion à la base de données
 * @returns {import('express').Router} - Router Express configuré
 */
const authRoutes = (connection) => {
    const router = express.Router();
    const userModel = new UserModel(connection);

    router.post("/login", loginUser(userModel));
    router.post("/signup", signupUser(userModel));

    return router;
};

export default authRoutes;
