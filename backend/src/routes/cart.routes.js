import express from 'express';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import {
  getUserCart,
  addProductToCart,
  removeProductFromCart,
  clearUserCart
} from '../controllers/cart.controller.js';
import { checkTokenValid } from '../middlewares/auth.middleware.js';

/**
 * Définit les routes pour la gestion du panier
 * @param {object} connection - Instance de connexion à la base de données
 * @returns {import('express').Router} - Router Express configuré
 */
const cartRoutes = (connection, baseUrl) => {
  const router = express.Router();
  const productModel = new ProductModel(connection, baseUrl);
  const cartModel = new CartModel(connection , productModel);

  // Récupérer le panier d'un utilisateur
  router.get('/me', checkTokenValid, getUserCart(cartModel));
  // Ajouter un produit au panier
  router.post('/add',checkTokenValid, addProductToCart(cartModel));
  // Retirer un produit du panier
  router.delete('/remove',checkTokenValid, removeProductFromCart(cartModel));
  // Vider le panier
  router.delete('/clear',checkTokenValid, clearUserCart(cartModel));

  return router;
};

export default cartRoutes;