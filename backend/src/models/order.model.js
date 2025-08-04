export class OrderModel {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Crée une commande dans la BDD
     * @param {number} userId - Identifiant de l'utilisateur
     * @param {Array} items - Liste des produits [{product_id, name, price, imageURL, quantity}]
     * @returns {Promise<number>} - Id de la commande créée
     */
    async createOrder(userId, items) {
        // Crée la commande
        const result = await this.connection.execute(
            'INSERT INTO orders (user_id, createdAt) VALUES (?, NOW())',
            [userId]
        );
        const orderId = result.insertId;

        // Ajoute les produits à la commande
        for (const item of items) {
            await this.connection.execute(
                'INSERT INTO productOrder (fk_product, fk_order, quantity, price) VALUES (?, ?, ?, ?)',
                [item.product_id, orderId, item.quantity, item.price]
            );
        }
        return orderId;
    }

    /**
     * Récupère la dernière commande passée par un utilisateur.
     * 
     * @param {number} userId - Identifiant de l'utilisateur
     * @returns {Promise<Object|null>} - La dernière commande trouvée ou null si aucune
     */
    async getLastOrder(userId) {
        const [result] = await this.connection.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC LIMIT 1',
            [userId]
        );
        return result;
    }

    /**
     * Récupère toutes les commandes passées par un utilisateur.
     * @param {number} userId - Identifiant de l'utilisateur
     * @returns {Promise<Array<Object>>} - Liste des commandes
     */
    async getAllOrders(userId) {
        const result = await this.connection.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC',
            [userId]
        );
        return result;
    }

    /**
     * Récupère une commande par son id (avec ses produits)
     * @param {number} orderId - Identifiant de la commande
     * @returns {Promise<Object|null>} - La commande et ses produits
     */
    async getOrderById(orderId) {
        const result = await this.connection.execute(
            'SELECT * FROM orders WHERE id = ?',
            [orderId]
        );
        const order = result[0];

        const products = await this.connection.execute(
            `SELECT 
                p.id,
                p.name,
                po.quantity AS order_quantity,
                po.price AS order_price
            FROM productOrder po
            JOIN product p ON p.id = po.fk_product
            WHERE po.fk_order = ?`,
            [orderId]
        );
        if (!order) return null;
        order.products =  Array.isArray(products) ? products : [products];

        return order;
    }

}