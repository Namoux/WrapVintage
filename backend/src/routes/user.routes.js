import express from "express";
import { UserModel } from "../models/user.model.js";
import {
    getAllUsersActive,
    getAllUsersArchived,
    getUserById,
    updateUser, 
    deleteUser,
} from "../controllers/user.controller.js";
import { checkTokenAdmin, checkTokenValid } from "../middlewares/auth.middleware.js";

/**
 * Définit les routes pour la gestion des utilisateurs
 * @param {object} connection - Instance de connexion à la base de données
 * @returns {import('express').Router} - Router Express configuré
 */
const userRoutes = (connection) => {
    const router = express.Router();
    const userModel = new UserModel(connection);
    
    router.get("/all", checkTokenAdmin(connection), getAllUsersActive(userModel));
    router.get("/archived", checkTokenAdmin(connection), getAllUsersArchived(userModel));
    router.get("/:id", checkTokenAdmin(connection), getUserById(userModel));
    router.put("/update/:id", checkTokenValid, updateUser(userModel));
    router.delete("/delete/:id", checkTokenValid, deleteUser(userModel));
    
    return router;
};

export default userRoutes;