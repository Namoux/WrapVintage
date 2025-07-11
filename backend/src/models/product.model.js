export class ProductModel {

    /**
     * Initialise le modèle avec la connexion à la BDD
     * @param {object} connection - Instance de connexion à la base de données
     * @param {string} baseUrl - URL de base pour les images
     */
    constructor(connection, baseUrl) {
        this.connection = connection;
        this.baseUrl = baseUrl;
    }

    /**
     * Renvoie tous les produits actifs (non archivés)
     * @param {number} limit - Nombre maximum de produits à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getAllProductsActive(limit) {
        const result = await this.connection.execute('SELECT * FROM product WHERE is_archived = FALSE LIMIT ?', [limit]);
        // console.log("result : ", result);
        return this.addImageUrl(result);
    }

    /**
     * Ajoute un ou plusieurs produits dans la BDD
     * @param {Object|Array<Object>} newProducts - Produit(s) à ajouter
     * @returns {Promise<Array<Object>>}
     * @throws {Error} - Si la catégorie n'existe pas
     */
    async addProduct(newProducts) {
        const categories = await this.connection.execute('SELECT * FROM category');

        if (newProducts.length === undefined) {
            const categoryExists = categories.find(cat => cat.id === newProducts.categoryId);
            if (!categoryExists) {
                throw new Error("Categorie doesn't exist");
            } else {
                if (newProducts.is_new == undefined) {
                    await this.connection.execute(
                        'INSERT INTO product (name, description, price, imageURL, quantity) VALUES (?,?,?,?,?)',
                        [newProducts.name, newProducts.description, newProducts.price, newProducts.imageURL, newProducts.quantity]
                    );
                } else {
                    await this.connection.execute(
                        'INSERT INTO product (name, description, price, imageURL, quantity, is_new) VALUES (?,?,?,?,?,?)',
                        [newProducts.name, newProducts.description, newProducts.price, newProducts.imageURL, newProducts.quantity, newProducts.is_new]
                    );
                }

                const productCreated = await this.connection.execute('SELECT MAX(id) AS lastId FROM product');
                await this.connection.execute(
                    'INSERT INTO productCategory (fk_product, fk_category) VALUES (?,?)',
                    [productCreated[0].lastId, newProducts.categoryId]
                );
            }

            return [newProducts];
        } else {
            for (const newProduct of newProducts) {
                const categoryExists = categories.find(cat => cat.id === newProduct.categoryId);
                if (!categoryExists) {
                    throw new Error("Categorie doesn't exist");
                }

                if (newProduct.is_new == undefined) {
                    await this.connection.execute(
                        'INSERT INTO product (name, description, price, imageURL, quantity) VALUES (?,?,?,?,?)',
                        [newProduct.name, newProduct.description, newProduct.price, newProduct.imageURL, newProduct.quantity]
                    );
                } else {
                    await this.connection.execute(
                        'INSERT INTO product (name, description, price, imageURL, quantity, is_new) VALUES (?,?,?,?,?,?)',
                        [newProduct.name, newProduct.description, newProduct.price, newProduct.imageURL, newProduct.quantity, newProduct.is_new]
                    );
                }

                const [productCreated] = await this.connection.execute('SELECT MAX(id) AS lastId FROM product');
                await this.connection.execute(
                    'INSERT INTO productCategory (fk_product, fk_category) VALUES (?,?)',
                    [productCreated.lastId, newProduct.categoryId]
                );
            }

            return newProducts;
        }
    }

    /**
     * Renvoie un produit par son id
     * @param {number} id - Identifiant du produit
     * @returns {Promise<Array<Object>>}
     */
    async getProductById(id) {
        const result = await this.connection.execute('SELECT * FROM product WHERE id = ?', [id]);
        // console.log("result : ", result);
        return this.addImageUrlHD(result);
    }

    /**
     * Renvoie tous les produits archivés
     * @param {number} limit - Nombre maximum de produits à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getAllArchivedProducts(limit) {
        const result = await this.connection.execute('SELECT * FROM product WHERE is_archived = TRUE LIMIT ?', [limit]);
        // console.log("result : ", result);
        return this.addImageUrl(result);
    }
    
    /**
     * Renvoie tous les nouveaux produits
     * @param {number} limit - Nombre maximum de produits à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getAllNewProducts(limit) {
        const result = await this.connection.execute('SELECT * FROM product WHERE is_new = TRUE LIMIT ?', [limit]);
        // console.log("result : ", result);
        return this.addImageUrl(result);
    }

    /**
     * Renvoie les produits de la catégorie Homme
     * @param {number} limit - Nombre maximum de produits à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getProductHomme(limit) {
        const result = await this.connection.execute('SELECT p.id, p.name, p.description, p.price, p.imageURL, p.quantity FROM product AS p INNER JOIN productCategory AS pc ON p.id = pc.fk_product INNER JOIN category AS c ON c.id = pc.fk_category WHERE c.id = 1 LIMIT ?', [limit]);
        // console.log("result : ", result);
        return this.addImageUrl(result);
    }

    /**
     * Renvoie les produits de la catégorie Femme
     * @param {number} limit - Nombre maximum de produits à retourner
     * @returns {Promise<Array<Object>>}
     */
    async getProductFemme(limit) {
        const result = await this.connection.execute('SELECT p.id, p.name, p.description, p.price, p.imageURL, p.quantity FROM product AS p INNER JOIN productCategory AS pc ON p.id = pc.fk_product INNER JOIN category AS c ON c.id = pc.fk_category WHERE c.id = 2 LIMIT ?', [limit]);
        // console.log("result : ", result);
        return this.addImageUrl(result);
    }

    /**
     * Met à jour un produit existant
     * @param {number} id - Identifiant du produit à modifier
     * @param {Object} product - Ancien produit
     * @param {Object} editProduct - Nouveaux champs à modifier
     * @returns {Promise<void>}
     * @throws {Error} - Si un paramètre est incorrect
     */
    async updateProduct(id, product, editProduct) {
        for await (const [key, value] of Object.entries(editProduct)) {
            if (key in product) {
                this.connection.execute(`UPDATE product SET ${key} = ? WHERE id = ?`, [value, id]);
                // some renvoi true si la value existe dans category id
            } else if (key === "categoryId" && categories.some(cat => cat.id === Number(value))) {
                this.connection.execute('UPDATE productCategory SET fk_category = ? WHERE fk_product = ?', [value, id]);
            } else {
                // On lève une erreur pour que le controller la gère
                const error = new Error(`Wrong param: ${key}`);
                error.statusCode = 400;
                throw error;
            }
        };
    }

    /**
     * Archive (supprime logiquement) un produit
     * @param {number} id - Identifiant du produit à archiver
     * @returns {Promise<void>}
     */
    async deleteProduct(id) {
        await this.connection.execute('UPDATE product SET is_archived = TRUE WHERE id = ?', [id]);
    }

    /**
     * Recherche des produits par nom
     * @param {string} query - Terme de recherche
     * @returns {Promise<Array<Object>>}
     */
    async getSearchProduct(query) {
        const result = await this.connection.execute('SELECT * FROM product WHERE LOWER(name) LIKE LOWER(?)', [`${query}%`]);
        // console.log("result : ", result);
        return this.addImageUrl(result);
    }

    /**
     * Ajoute l'URL de l'image vignette à chaque produit
     * @param {Array<Object>} products - Liste des produits
     * @returns {Array<Object>}
     */
    addImageUrl(products) {
        return products.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/vignettes/${product.imageURL}`
        }));
    }

    /**
     * Ajoute l'URL de l'image HD à chaque produit
     * @param {Array<Object>} products - Liste des produits
     * @returns {Array<Object>}
     */
    addImageUrlHD(products) {
        return products.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/produits/${product.imageURL}`
        }));
    }
}
