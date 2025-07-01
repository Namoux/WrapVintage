
export class ProductModel {

    constructor(connection, baseUrl) {
        this.connection = connection;
        this.baseUrl = baseUrl;
    };

    /**
 * Renvoi un produit de la BDD en fonction de son id
 * @param {number} id 
 * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:Boolean}|undefined} 
 */
    async getProductById(id) {
        console.log("Client get product by Id");

        const result = await this.connection.execute('SELECT * FROM product WHERE id = ?', [id]);
        console.log("result : ", result);

        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/produits/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));

        return productsWithImageUrl;
    };

    /**
     * Retourne un tableau contenant tout les produits.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getAllProductsActive(limit) {
        console.log("limit :", limit);
        console.log("Client get All products active");

        const result = await this.connection.execute('SELECT * FROM product WHERE is_archived = FALSE LIMIT ?', [limit]);
        console.log("result : ", result);

        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/vignettes/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));

        return productsWithImageUrl;
    };

    /**
     * Retourne un tableau contenant tout les produits archivés.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getAllProductsArchived(limit) {
        console.log("limit :", limit);
        console.log("Client get All products archived");

        const result = this.connection.execute('SELECT * FROM product WHERE is_archived = TRUE LIMIT ?', [limit]);
        console.log("result : ", result);

        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/vignettes/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));

        return productsWithImageUrl;
    };

    /**
     * Retourne un tableau contenant tout les produits de la categorie homme.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getProductHomme() {
        console.log("Client get products Bracelet Homme");

        const result = await this.connection.execute('SELECT p.id, p.name, p.description, p.price, p.imageURL, p.quantity FROM product AS p INNER JOIN productCategory AS pc ON p.id = pc.fk_product INNER JOIN category AS c ON c.id = pc.fk_category WHERE c.id = 1');
        console.log("result : ", result);

        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/vignettes/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));

        return productsWithImageUrl;
    };

    /**
     * Retourne un tableau contenant tout les produits de la categorie femme.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getProductFemme() {
        console.log("Client get products Bracelet Femme");

        const result = await this.connection.execute('SELECT p.id, p.name, p.description, p.price, p.imageURL, p.quantity FROM product AS p INNER JOIN productCategory AS pc ON p.id = pc.fk_product INNER JOIN category AS c ON c.id = pc.fk_category WHERE c.id = 2');
        console.log("result : ", result);

        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/vignettes/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));

        return productsWithImageUrl;
    };

        /**
     * Retourne un tableau contenant tout les nouveaux produits.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getAllnewProducts() {
        console.log("Client get new products");

        const result = await this.connection.execute('SELECT * FROM product WHERE is_new = TRUE');
        console.log("result : ", result);
        
        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/vignettes/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));
        
        return productsWithImageUrl;
    };

    /**
     * Renvoi un produit de la BDD en fonction de la lettre commençée
     * @param {string} query 
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getSearchProduct(query) {
        console.log("Client search a product");
 
        const result = await this.connection.execute('SELECT * FROM product WHERE LOWER(name) LIKE LOWER(?)', [`${query}%`]);
        // console.log("result : ", result);
 
        // Ajouter l'URL de l'image à chaque produit
        const productsWithImageUrl = result.map(product => ({
            ...product,
            imageURL: `${this.baseUrl}/produits/${product.imageURL}` //Construction du lien avec le nom de l'image
        }));

        return productsWithImageUrl;
    };

    /**
     * Renvoi une categorie de la BDD en fonction de son id
     * @param {number} id 
     * @returns {{id:number,name:string} | undefined} 
    */
   async getCategoryById(id) {
       console.log("Client get category by Id");
       
       const result = await this.connection.execute('SELECT * FROM category WHERE id = ?', [id] );
       console.log("result : ", result);
       
       return result;
    };
    
    /**
     * Renvoi les categories de la BDD
     * @returns {{id:number,name:string} | undefined} 
    */
   async getAllCategory() {
       console.log("Client get All categories");

        const result = await this.connection.execute('SELECT * FROM category');
        console.log("result : ", result);

       return result;

    };

    /**
     * Renvoi un user de la BDD en fonction de son id
     * @param {number} id 
     * @returns {{id:number,username:string, password:number, email:string, is_admin:number, deleted_at: date} | undefined} 
     */
    async getUserById(id) {
        console.log("Client get user by Id");

        const result = await this.connection.execute('SELECT * FROM user WHERE id = ?', [id]);
        console.log("result : ", result);

        return result;
    };

    /**
     * Renvoi un user de la BDD en fonction de son id
     * @param {number} limit 
     * @returns {{id:number,username:string, password:number, email:string, is_admin:number, deleted_at: date} | undefined} 
     */
    async getAllUsersActive(limit) {
        console.log("Client get all users active");

        const result = await this.connection.execute('SELECT * FROM user WHERE deleted_at IS NULL LIMIT ?', [limit]);
        console.log("result : ", result);

        return result;
    };
    
    /**
     * Renvoi un user de la BDD en fonction de son id
     * @param {number} limit 
     * @returns {{id:number,username:string, password:number, email:string, is_admin:number, deleted_at: date} | undefined} 
     */
    async getAllUsersDeleted(limit) {
        console.log("Client get all users deleted");

        const result = await this.connection.execute('SELECT * FROM user WHERE deleted_at IS NOT NULL LIMIT ?', [limit]);
        console.log("result : ", result);

        return result;
    };

}

