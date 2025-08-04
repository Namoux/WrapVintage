
/**
 * Crée une nouvelle commande dans la base de données.
 *
 * @param {OrderModel} orderModel - Instance du modèle OrderModel pour gérer les commandes.
 * @returns {Function} Middleware Express pour la création de commande.
 *
 * Le corps de la requête doit contenir :
 *   - userId : l'identifiant de l'utilisateur
 *   - items : la liste des produits à commander
 */
export const createOrder = (orderModel) => async (req, res, next) => {
    try {
        console.log("Order in creation...");

        // Récupère les paramètres envoyés par le frontend
        const { userId, items } = req.body;

        // Vérifie la présence des paramètres obligatoires
        if (!userId || !items || !items.length) {
            console.log("Paramètres manquants");
            return res.status(400).json({ error: "Paramètres manquants" });
        }

        // Crée la commande via le modèle
        const orderId = await orderModel.createOrder(userId, items);

        // Retourne l'id de la commande créée
        return res.status(201).json({ orderId });
    } catch (error) {
        console.log("Erreur dans la creation de la commande");
        next(error);
    }
};

/**
 * Récupère la dernière commande passée par un utilisateur.
 *
 * @param {OrderModel} orderModel - Instance du modèle OrderModel pour gérer les commandes.
 * @returns {Function} Middleware Express pour récupérer la dernière commande.
 *
 * L'identifiant utilisateur doit être passé en paramètre d'URL : /orders/last/:userId
 */
export const getLastOrder = (orderModel) => async (req, res, next) => {
    try {
        console.log("Client get last order");

        // Récupère l'id utilisateur depuis les paramètres d'URL
        const userId = req.params.userId;

        // Récupère la dernière commande de l'utilisateur via le modèle
        const order = await orderModel.getLastOrder(userId);

        // Si aucune commande trouvée, retourne une erreur 404
        if (!order) return res.status(404).json({ error: "Aucune commande trouvée" });

        // Retourne la commande trouvée
        res.json(order);
    } catch (error) {
        console.log("Error in get last order");
        next(error);
    }
};

/**
 * Récupère toutes les commandes passées par un utilisateur.
 *
 * @param {OrderModel} orderModel - Instance du modèle OrderModel
 * @returns {Function} Middleware Express
 */
export const getAllOrders = (orderModel) => async (req, res, next) => {
    try {
        console.log("Client get all his orders");

        // Récupère l'id utilisateur depuis les paramètres d'URL
        const userId = req.params.userId;

        // Récupère toutes les commandes de l'utilisateur via le modèle
        const orders = await orderModel.getAllOrders(userId);

        // Retourne les commandes trouvées
        res.json(orders);
    } catch (error) {
        console.log("Error in get ALL last order");
        next(error);
    }
};

/**
 * Récupère une commande par son id
 */
export const getOrderById = (orderModel) => async (req, res, next) => {
    try {
        console.log("Client get order by id");

        // Récupère l'id de la commande depuis les paramètres d'URL
        const orderId = req.params.orderId;

        // Récupère la commande spécifiée de l'utilisateur via le modèle
        const order = await orderModel.getOrderById(orderId);

        // Si aucune commande trouvée, retourne une erreur 404
        if (!order) return res.status(404).json({ error: "Commande non trouvée" });

        console.log("order in controller", order);
        // Retourne la commande trouvée
        res.json(order);
    } catch (error) {
        console.log("Error in get order by id");
        next(error);
    }
};