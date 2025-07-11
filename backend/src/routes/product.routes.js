import express from 'express';
import { ProductModel } from '../models/product.model.js';
import { getAllProducts,
    getAllNewProducts,
    getAllArchivedProducts,
    getProductHomme,
    getProductFemme,
    getSearchProduct,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { checkTokenAdmin } from '../middlewares/auth.middleware.js';

/**
 * Définit les routes pour la gestion des produits
 * @param {object} connection - Instance de connexion à la base de données
 * @param {string} baseUrl - URL de base pour les images
 * @returns {import('express').Router} - Router Express configuré
 */
const productRoutes = (connection, baseUrl) => {
    const router = express.Router();
    const productModel = new ProductModel(connection, baseUrl);

    router.get('/all', getAllProducts(productModel));
    router.get('/news', getAllNewProducts(productModel));
    router.get('/archived', checkTokenAdmin(connection), getAllArchivedProducts(productModel));
    router.get('/hommes', getProductHomme(productModel));
    router.get('/femmes', getProductFemme(productModel));
    router.get('/search/:query', getSearchProduct(productModel));
    router.get('/:id', getProductById(productModel));
    router.post('/add',checkTokenAdmin(connection), addProduct(productModel));
    router.put('/update/:id',checkTokenAdmin(connection), updateProduct(productModel));
    router.delete('/delete/:id',checkTokenAdmin(connection), deleteProduct(productModel));
    
    return router;
};

export default productRoutes;
