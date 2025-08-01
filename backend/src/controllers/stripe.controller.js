import { CLIENT_URL, stripe } from "../config.js";

/**
 * Crée une session Stripe Checkout pour le paiement du panier.
 * 
 * @param {Request} req - Requête Express contenant le panier et l'utilisateur dans req.body
 * @param {Response} res - Réponse Express pour retourner l'id de session Stripe
 * @param {Function} next - Fonction middleware Express pour la gestion des erreurs
 * @returns {void}
 * 
 * Exporte { sessionId } pour rediriger le client vers Stripe Checkout.
 */
export const createCheckoutSession = async (req, res, next) => {
    try {

        console.log("Client wants to pay");

        // On reçoit le panier et l'utilsateur du front end
        const { cart, user } = req.body;

        // Transforme chaque produit du panier en un objet Stripe "line_item"
        const line_items = cart.map(item => ({
            price_data: {
                currency: 'eur', // Devise utilisée
                product_data: {
                    name: item.name, // Nom du produit
                    metadata: {
                        // On stocke l'id du produit de notre base dans le metadata Stripe pour le retrouver facilement dans le webhook
                        product_id: item.product_id.toString()
                    }
                },
                unit_amount: Math.round(item.price * 100), // Convertit le prix en euros (€) en centimes (Stripe attend un prix en centimes, , donc 12.99€ devient 1299)
            },
            quantity: item.quantity, // Quantité commandée
        }));

        // Crée une session Stripe Checkout avec les infos du panier et de l'utilisateur
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Méthodes de paiement acceptées
            mode: 'payment',                // Mode de paiement unique
            line_items,                     // Produits à payer
            customer_email: user.email,     // Email du client pour Stripe
            success_url: `${CLIENT_URL}/success`, // URL de redirection après paiement réussi
            cancel_url: `${CLIENT_URL}/cancel`,   // URL de redirection si paiement annulé
        });
        
        res.json({ sessionId: session.id });
    } catch (error) {
        console.log("Erreur de session Stripe");
        next(error);
    }
}

/**
 * Endpoint Stripe Webhook pour traiter les événements de paiement.
 *
 * - Gère l'événement 'checkout.session.completed' envoyé par Stripe après un paiement réussi.
 * - Récupère les informations de la session Stripe et les line_items associés.
 * - Identifie l'utilisateur via son email.
 * - Crée la commande dans la base de données et vide le panier de l'utilisateur.
 * - Répond toujours à Stripe avec un status 200 pour confirmer la réception du webhook.
 *
 * @param {OrderModel} orderModel - Modèle pour gérer les commandes.
 * @param {CartModel} cartModel - Modèle pour gérer les paniers.
 * @param {UserModel} userModel - Modèle pour gérer les utilisateurs.
 * @returns {Function} Middleware Express pour la route webhook Stripe.
 */
export const stripeWebhook = (orderModel, cartModel, userModel) => async (req, res) => {
    try {
        console.log("Yeah! payment succes!!");

        // Stripe envoie l'événement webhook dans le corps de la requête (req.body).
        // Ici, on récupère cet événement pour traiter le type d'événement reçu (ex : paiement réussi).
        const event = req.body;

        // Vérifie si l'événement Stripe reçu correspond à un paiement réussi (checkout.session.completed)
        if (event.type === 'checkout.session.completed') {
            // Récupère l'objet session Stripe associé à l'événement
            const session = event.data.object;

            // Récupère les line_items via l'API Stripe
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            // Récupère l'email du client
            const email = session.customer_email;

            // Utilise le UserModel pour retrouver l'utilisateur
            const users = await userModel.getUserByEmail(email);
            const user = Array.isArray(users) ? users[0] : users;
            if (!user || !user.id) {
                console.log("Utilisateur non trouvé pour l'email :", email);
                return res.status(200).send();
            }

            const items = await Promise.all(lineItems.data.map(async item => {
                // Pour chaque produit du panier Stripe, on récupère l'objet produit Stripe associé
                // Cela permet d'accéder au metadata où on a stocké l'id du produit de notre base
                const product = await stripe.products.retrieve(item.price.product);

                return {
                    // On récupère l'id du produit de notre base depuis le metadata Stripe (stocké lors de la création de la session)
                    product_id: parseInt(product.metadata.product_id, 10),
                    // Nom du produit (récupéré depuis Stripe)
                    name: product.name,
                    // Prix total de la ligne (Stripe le donne en centimes, on le convertit en euros)
                    price: item.amount_total / 100,
                    // Quantité commandée pour ce produit
                    quantity: item.quantity
                };
            }));

            console.log("user.id utilisé pour createOrder :", user.id);

            // Crée la commande dans la base de donnée via orderModel
            const orderId = await orderModel.createOrder(user.id, items);

            console.log("Commande créée via Stripe webhook, id :", orderId);

            // Vide le panier de l'utilisateur via CartModel
            const cartData = await cartModel.getCart(user.id);
            if (cartData && cartData.cartId) {
                await cartModel.clearCart(cartData.cartId);
                console.log("Panier vidé via CartModel pour l'utilisateur :", user.id);
            }
        }
        res.status(200).send();
    } catch (error) {
        console.error("Erreur Stripe Webhook :", error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }

};