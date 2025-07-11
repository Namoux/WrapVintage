import express from 'express';
import { CategoryModel } from '../models/category.model.js';
import { getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
 } from '../controllers/category.controller.js';
import { checkTokenAdmin } from '../middlewares/auth.middleware.js';

/**
 * Définit les routes pour la gestion des catégories
 * @param {object} connection - Instance de connexion à la base de données
 * @returns {import('express').Router} - Router Express configuré
 */
const categoryRoutes = (connection) => {
    const router = express.Router();
    const categoryModel = new CategoryModel(connection);

    router.get('/all', checkTokenAdmin(connection), getAllCategories(categoryModel));
    router.get('/:id', checkTokenAdmin(connection), getCategoryById(categoryModel));
    router.post('/add', checkTokenAdmin(connection), addCategory(categoryModel));
    router.put('/update/:id', checkTokenAdmin(connection), updateCategory(categoryModel));
    router.delete('/delete/:id', checkTokenAdmin(connection), deleteCategory(categoryModel));

    return router;
};

export default categoryRoutes;
