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
}