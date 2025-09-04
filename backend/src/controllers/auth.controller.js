import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRETKEY, NODE_ENV } from '../config.js';

/**
 * Authentifie un utilisateur et retourne un token JWT
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const loginUser = (userModel) => async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log("req", req.body);

        if (!username || !password) {
            console.log("Username and password are required!");
            return res.status(400).json({ error: "Username and password are required!" });
        }

        const users = await userModel.getUserforLogin(username);
        console.log("req", req.body);


        if (!users || users.length === 0) {
            console.log("Unknown client");
            return res.status(400).json({ error: "Unauthorized" });
        }

        const user = users[0];
        console.log("user", user);

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log("Unauthorized");
            return res.status(400).json({ error: "Unauthorized" });
        }

        const token = jwt.sign(
            {
                username: user.username,
                id: user.id,
            },
            SECRETKEY,
            { expiresIn: '1h' }
        );

        console.log(`${user.username} logged in successfully`);

        // Envoie le token en cookie sécurisé
        res.cookie('token', token, {
            httpOnly: true,       // pas accessible en JS client
            secure: false,         // en local! 
            sameSite: 'Strict',    // protection CSRF
            // secure: true,       // nécessite HTTPS (en prod) nécessaire si SameSite=None
            // sameSite: 'none',   // protection CSRF
            maxAge: 3600000       // 1 heure en ms
        });

        return res.status(200).json({
            message: "logged in",
            id: user.id,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.log("Error login user ");
        next(error);
    }
};

/**
 * Inscrit un nouvel utilisateur dans la base de données
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const signupUser = (userModel, cartModel) => async (req, res, next) => {
    try {
        const { username, password, email, is_admin } = req.body;

        if (!username || !password || !email) {
            console.log('Username, password and email are required');
            return res.status(400).json({ error: 'Username, password and email are required' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        // Crée l'utilisateur et récupère son id
        const userId = await userModel.createUser({ username, hashPassword, email, is_admin });

        // Crée le panier pour ce nouvel utilisateur
        await cartModel.getOrCreateCart(userId);

        console.log('User created successfully');
        return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.log('Error creating user: ');

        if (error.code === "ER_DUP_ENTRY") {
            console.log('Error creating user: User already in database');
            return res.status(400).json({ error: 'User already created' });
        } else {
            next(error);
        }
    }
};

/**
 * Récupère l'utilisateur actuellement connecté à partir du token JWT présent dans les cookies.
 * @param {UserModel} userModel - Modèle utilisateur pour accéder à la base de données
 * @returns {Function} - Middleware Express qui renvoie les infos de l'utilisateur ou une erreur d'authentification
 */
export const getCurrentUser = (userModel) => async (req, res, next) => {
    try {
        console.log("Client get current User himself");
        // Récupère le token JWT depuis les cookies
        const token = req.cookies.token;

        // Si aucun token, l'utilisateur n'est pas authentifié
        if (!token) {
            console.log("Non authentifié");
            return res.status(401).json({ error: "Non authentifié" });
        }

        // Vérifie et décode le token avec la clé secrète
        const decoded = jwt.verify(token, SECRETKEY);

        // Récupère l'utilisateur correspondant à l'id du token
        const users = await userModel.getUserById(decoded.id);
        if (!users || users.length === 0) {
            console.log("Utilisateur introuvable");
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        // Renvoie les infos de l'utilisateur (sans le mot de passe)
        const user = users[0];
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            adresse: user.adresse
        });
    } catch (err) {
        console.log("Error in get current User himself");
        // Si le token est invalide ou expiré
        res.status(401).json({ error: "Token invalide" });
    }
};

/**
 * Déconnecte l'utilisateur en supprimant le cookie du token JWT.
 * @returns {Function} - Middleware Express qui renvoie un message de succès
 */
export const logoutUser = () => (req, res) => {
    // Supprime le cookie 'token' côté client
    res.clearCookie('token', {
        httpOnly: true, // Le cookie n'est pas accessible en JS côté client
        sameSite: 'Lax', // Protection CSRF, ou 'None' si sous-domaines/HTTPS
        secure: NODE_ENV === 'production' // Cookie envoyé uniquement en HTTPS
    });

    console.log("logged out successfully");
    // Renvoie un message de succès
    return res.status(200).json({ message: "Déconnecté avec succès" });
};
