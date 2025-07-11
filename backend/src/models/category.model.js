export class CategoryModel {

    /**
     * Initialise le modèle avec la connexion à la BDD
     * @param {object} connection - Instance de connexion à la base de données
     */
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Ajoute une ou plusieurs catégories dans la BDD
     * @param {{name:string}|Array<{name:string}>} newCategory - Catégorie(s) à ajouter
     * @returns {Promise<{name:string}|Array<{name:string}>>} - Catégorie(s) ajoutée(s)
     */
    async addCategory(newCategory) {
        if (newCategory.length === undefined) {
            // Un seul objet
            await this.connection.execute('INSERT INTO category (name) VALUES (?)', [newCategory.name]);
        } else {
            // Plusieurs objets
            for (const oneCategory of newCategory) {
                await this.connection.execute('INSERT INTO category (name) VALUES (?)', [oneCategory.name]);
            }
        }
        return newCategory;
    }

    /**
     * Renvoie toutes les catégories de la BDD
     * @param {number} limit - Nombre maximum de catégories à retourner
     * @returns {Promise<Array<{id:number,name:string}>>}
     */
    async getAllCategories(limit) {
        const result = await this.connection.execute('SELECT * FROM category LIMIT ?', [limit]);
        // console.log("result : ", result);

        return result;

    };

/**
 * Renvoi une categorie de la BDD en fonction de son id
 * @param {number} id 
 * @returns {Promise<Array<{id:number,name:string}>>}
 */
    async getCategoryById(id) {
        const result = await this.connection.execute('SELECT * FROM category WHERE id = ?', [id]);
        // console.log("result : ", result);

        return result;
    };

    /**
     * Met à jour une catégorie existante
     * @param {number} id - Identifiant de la catégorie à modifier
     * @param {{id:number,name:string}} category - Ancienne catégorie
     * @param {object} editCategory - Nouveaux champs à modifier
     * @returns {Promise<void>}
     * @throws {Error} - Si un paramètre est incorrect
     */
    async updateCategory(id, category, editCategory) {

        for await (const [key, value] of Object.entries(editCategory)) {
            if (key in category) {
                // console.log(key, value);
                this.connection.execute(`UPDATE category SET ${key} = ? WHERE id = ?`, [value, id]);
            } else {
                // On lève une erreur pour que le controller la gère
                const error = new Error(`Wrong param: ${key}`);
                error.statusCode = 400;
                throw error;
            }
        };
    }

    /**
     * Supprime une catégorie de la BDD
     * @param {number} id - Identifiant de la catégorie à supprimer
     * @returns {Promise<void>}
     */
    async deleteCategory(id) {
        // await connection.execute('DELETE FROM productCategory WHERE fk_category = ?', [categoryId]);  Plus besoin ds la BDD delete ON CASCADE
        await this.connection.execute('DELETE FROM category WHERE id = ?', [id]);
    }
}