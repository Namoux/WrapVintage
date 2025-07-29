
export class UserModel {

    /**
     * Initialise le modèle avec la connexion à la BDD
     * @param {object} connection - Instance de connexion à la base de données
     */
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Renvoie tous les utilisateurs actifs (non supprimés)
     * @param {number} limit - Nombre maximum d'utilisateurs à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getAllUsersActive(limit) {
        const result = await this.connection.execute('SELECT * FROM user WHERE deleted_at IS NULL LIMIT ?', [limit]);
        // console.log("result : ", result);
        return result;
    }

    /**
     * Renvoie tous les utilisateurs archivés (supprimés)
     * @param {number} limit - Nombre maximum d'utilisateurs à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getAllUsersArchived(limit) {
        const result = await this.connection.execute('SELECT * FROM user WHERE deleted_at IS NOT NULL LIMIT ?', [limit]);
        // console.log("result : ", result);
        return result;
    }

    /**
     * Renvoie un utilisateur par son id
     * @param {number} id - Identifiant de l'utilisateur
     * @returns {Promise<Array<Object>>}
     */
    async getUserById(id) {
        const result = await this.connection.execute('SELECT * FROM user WHERE id = ? AND deleted_at IS NULL', [id]);
        // console.log("result : ", result);
        return result;
    }

    /**
     * Crée un nouvel utilisateur
     * @param {Object} param0 - Données de l'utilisateur
     * @param {string} param0.username - Nom d'utilisateur
     * @param {string} param0.hashPassword - Mot de passe hashé
     * @param {string} param0.email - Email de l'utilisateur
     * @param {boolean} [param0.is_admin] - Si l'utilisateur est admin
     * @returns {Promise<Object>}
     */
    async createUser({ username, hashPassword, email, is_admin }) {
        let result;
        if (is_admin === undefined) {
            result = await this.connection.execute(
                'INSERT INTO user (username, password, email) VALUES (?, ?, ?)',
                [username, hashPassword, email]
            );
        } else {
            result = await this.connection.execute(
                'INSERT INTO user (username, password, email, is_admin) VALUES (?, ?, ?, ?)',
                [username, hashPassword, email, is_admin]
            );
        }
        // Retourne l'id du nouvel utilisateur
        return result.insertId || (result[0] && result[0].insertId);
    }

    /**
     * Renvoie un utilisateur pour la connexion (login)
     * @param {string} username - Nom d'utilisateur
     * @returns {Promise<Array<Object>>}
     */
    async getUserforLogin(username) {
        const result = await this.connection.execute(`SELECT * FROM user WHERE username = ?`, [username]);
        // console.log("result : ", result);
        return result;
    }

    /**
     * Met à jour un utilisateur existant
     * @param {number} id - Identifiant de l'utilisateur à modifier
     * @param {Object} user - Ancien utilisateur
     * @param {Object} editUser - Nouveaux champs à modifier
     * @returns {Promise<void>}
     * @throws {Error} - Si un paramètre est incorrect
     */
    async updateUser(id, user, editUser) {
        for await (const [key, value] of Object.entries(editUser)) {
            if (key in user) {
                // if (key === "password") {
                //     const hashPassword = await bcrypt.hash(value, 10);
                //     this.connection.execute(`UPDATE user SET ${key} = ? WHERE id = ?`, [hashPassword, id]);
                // } else {
                await this.connection.execute(`UPDATE user SET ${key} = ? WHERE id = ?`, [value, id]);

            } else {
                // On lève une erreur pour que le controller la gère
                const error = new Error(`Wrong param: ${key}`);
                error.statusCode = 400;
                throw error;
            }
        };
    }

    /**
     * Archive (supprime logiquement) un utilisateur
     * @param {number} id - Identifiant de l'utilisateur à supprimer
     * @returns {Promise<void>}
     */
    async deleteUser(id) {
        await this.connection.execute(`UPDATE user SET deleted_at = NOW(), username = CONCAT('deleted_user_', ?), email = NULL, adresse = NULL, password = NULL WHERE id = ?`, [id, id]);
    }
}
