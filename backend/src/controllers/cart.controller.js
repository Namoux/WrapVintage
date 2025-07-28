
/**
 * Récupère le panier d'un utilisateur
 * @param {CartModel} cartModel - Modèle panier
 * @returns {Function} - Middleware Express
 */
export const getUserCart = (cartModel) => async (req, res, next) => {
    try {
        console.log("Client get user cart");
        const userId = req.user.id 
        
        if (!userId) {
            console.log("User ID manquant");
            return res.status(400).json({ error: "User ID manquant" });
        }
        const {products} = await cartModel.getCart(userId);
        
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error in get user cart");
        next(error);
    }
};

/**
 * Ajoute un produit au panier
 * @param {CartModel} cartModel - Modèle panier
 * @returns {Function} - Middleware Express
 */
export const addProductToCart = (cartModel) => async (req, res, next) => {
    try {
        console.log("Client add product to cart");
        const userId = req.user.id
        const { productId, quantity } = req.body;
        
        if (!userId || !productId) {
            console.log("Paramètres manquants");
            return res.status(400).json({ error: "Paramètres manquants" });
        }
        
        const cartId = await cartModel.createCart(userId);
        
        await cartModel.addToCart(cartId, productId, quantity || 1);

        console.log("Produit ajouté au panier");
        return res.status(201).json({ message: "Produit ajouté au panier" });
    } catch (error) {
        console.log("Erreur dans l'ajout du produit");
        next(error);
    }
};

/**
 * Retire un produit du panier
 * @param {CartModel} cartModel - Modèle panier
 * @param {UserModel} userModel - Modèle panier
 * @returns {Function} - Middleware Express
 */
export const removeProductFromCart = (cartModel, userModel) => async (req, res, next) => {
    try {
        console.log("Client want to remove on product from cart");
        const userId = req.user.id
        
        const { productId } = req.body;
        
        if (!userId || !productId) {
            console.log("Paramètres manquants");
            return res.status(400).json({ error: "Paramètres manquants" });
        }
        
        const cartData = await cartModel.getCart(userId);
        if (!cartData || !cartData.cartId){
            console.log("Panier introuvable");
            return res.status(404).json({ error: "Panier introuvable" });
        }

        await cartModel.removeFromCart(cartData.cartId, productId);

        console.log("Produit retiré du panier");
        return res.status(200).json({ message: "Produit retiré du panier" });
    } catch (error) {
        console.log("Erreur dans la suppression d'un produit du panier");
        next(error);
    }
};

/**
 * Vide le panier d'un utilisateur
 * @param {CartModel} cartModel - Modèle panier
 * @returns {Function} - Middleware Express
 */
export const clearUserCart = (cartModel) => async (req, res, next) => {
    try {
        console.log("Client wants to clear cart");
        const userId = req.user.id
        if (!userId) {
            console.log("User ID manquant");
            return res.status(400).json({ error: "User ID manquant" });
        }

        const cartData = await cartModel.getCart(userId);
        if (!cartData || !cartData.cartId){
            console.log("Panier introuvable");
            return res.status(404).json({ error: "Panier introuvable" });
        }

        await cartModel.clearCart(cartData.cartId);

        console.log("Panier vidé");
        return res.status(200).json({ message: "Panier vidé" });
    } catch (error) {
        console.log("Erreur dans le vidage du panier");
        next(error);
    }
};