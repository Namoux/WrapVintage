export class CartModel {
    /**
     * Initialise le modèle avec la connexion à la BDD
     * @param {object} connection - Instance de connexion à la base de données
     */
    constructor(connection, productModel) {
        this.connection = connection;
        this.productModel = productModel;
    }

    /**
     * Crée un panier pour un utilisateur (si non existant)
     * @param {number} userId - Identifiant de l'utilisateur
     * @returns {Promise<number>} - Identifiant du panier
     */
    async createCart(userId) {
        // Vérifie si le panier existe déjà
        const cart = await this.connection.execute(
            'SELECT id FROM cart WHERE user_id = ?',
            [userId]
        );
        if (cart.length > 0) return cart[0].id;

        // Crée un nouveau panier
        const result = await this.connection.execute(
            'INSERT INTO cart (user_id, createdAt) VALUES (?, NOW())',
            [userId]
        );
        return result.insertId;
    }

    /**
     * Ajoute un produit au panier
     * @param {number} cartId - Identifiant du panier
     * @param {number} productId - Identifiant du produit
     * @param {number} quantity - Quantité à ajouter
     * @returns {Promise<void>}
     */
    async addToCart(cartId, productId, quantity = 1) {
        await this.connection.execute(
            `INSERT INTO productCart (fk_cart, fk_product, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [cartId, productId, quantity, quantity]
        );
    }

    /**
     * Récupère le contenu du panier d'un utilisateur
     * @param {number} userId - Identifiant de l'utilisateur
     * @returns {Promise<Array<Object>>} - Liste des produits du panier
     */
    async getCart(userId) {
        const cart = await this.connection.execute(
            'SELECT id FROM cart WHERE user_id = ?',
            [userId]
        );
        if (cart.length === 0) return [];

        const cartId = cart[0].id;
        const products = await this.connection.execute(
            `SELECT pc.fk_product AS product_id, pc.quantity, p.name, p.price, p.imageURL
            FROM productCart pc
            JOIN product p ON pc.fk_product = p.id
            WHERE pc.fk_cart = ?`,
            [cartId]
        );
            // Ajoute les URLs d'image
    const productsWithUrl = this.productModel.addImageUrl(products);
        return { cartId, products: productsWithUrl };
    }

    /**
     * Retire un produit du panier
     * @param {number} cartId - Identifiant du panier
     * @param {number} productId - Identifiant du produit
     * @returns {Promise<void>}
     */
    async removeFromCart(cartId, productId) {
        await this.connection.execute(
            'DELETE FROM productCart WHERE fk_cart = ? AND fk_product = ?',
            [cartId, productId]
        );
    }

    /**
     * Vide le panier
     * @param {number} cartId - Identifiant du panier
     * @returns {Promise<void>}
     */
    async clearCart(cartId) {
        await this.connection.execute(
            'DELETE FROM productCart WHERE fk_cart = ?',
            [cartId]
        );
    }
}