import jwt from 'jsonwebtoken';
import { SECRETKEY } from '../config.js';

/**
 * Middleware de vérification d'un token valide (authentifié)
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {Function} next - Fonction next middleware
 * @returns {void}
 */
export function checkTokenValid(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error();

        const token = authHeader.split(" ")[1];
        const decodeToken = jwt.verify(token, SECRETKEY);
        
        // Ajoute l'id et le rôle dans req.user
        req.user = {
            id: decodeToken.id,
            is_admin: decodeToken.is_admin
        };
        
        console.log("Token authorized");
        next();
    } catch (error) {
        console.log("Wrong Token");
        return res.status(401).json({ msg: "Wrong token" });
    }
}

/**
 * Middleware de vérification d’un token admin (authentifié + admin)
 * @param {*} connection - La connexion à la BDD
 * @returns {function(import('express').Request, import('express').Response, Function): Promise<void>}
 */
export function checkTokenAdmin(connection) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) throw new Error();

            const token = authHeader.split(" ")[1];
            const decodeToken = jwt.verify(token, SECRETKEY);

            const IdUser = decodeToken.id;

            const user = await connection.execute('SELECT * FROM user WHERE id = ?', [IdUser]);

            if (user[0].is_admin === 1) {
                console.log("Token Admin valid");
                next();
            } else {
                console.log("Access denied, not Admin");
                return res.status(403).json({ msg: "Access denied, not Admin" });
            }

        } catch (error) {
            console.log("Wrong Token Admin");
            // next(error);
            return res.status(401).json({ msg: "Wrong token" });
        }
    };
}
