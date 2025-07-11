
/**
 * Middleware de gestion des erreurs Express
 * @param {Error} err - L'erreur capturée
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {Function} next - Fonction next middleware
 * @returns {void}
 */
export const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error:", err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
};
