import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRETKEY } from '../config.js';

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
            // secure: true,         // ⚠ nécessite HTTPS (en prod)
            secure: false,         // en local!
            sameSite: 'Strict',   // protection CSRF
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
export const signupUser = (userModel) => async (req, res, next) => {
    try {
        const { username, password, email, is_admin } = req.body;

        if (!username || !password || !email) {
            console.log('Username, password and email are required');
            return res.status(400).json({ error: 'Username, password and email are required' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await userModel.createUser({ username, hashPassword, email, is_admin });

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

export const getCurrentUser = (userModel) => async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "Non authentifié" });

    const decoded = jwt.verify(token, SECRETKEY);

    const users = await userModel.getUserById(decoded.id);
    if (!users || users.length === 0)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    const user = users[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      adresse: user.adresse
    });
  } catch (err) {
    res.status(401).json({ error: "Token invalide" });
  }
};

export const logoutUser = () => (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax', // ou 'None' si tu utilises des sous-domaines (et HTTPS)
    secure: process.env.NODE_ENV === 'production' // uniquement si HTTPS
  });

  console.log("logged out successfully");
  return res.status(200).json({ message: "Déconnecté avec succès" });
};
