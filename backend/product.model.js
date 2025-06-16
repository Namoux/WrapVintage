
export class ProductModel {

    constructor(connection) {
        this.connection = connection;
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

        return result;
    };

    /**
     * Retourne un tableau contenant tout les produits.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getAllProductsActive(limit) {
        console.log("limit :", limit);
        console.log("Client get All products active");

        const result = this.connection.execute('SELECT * FROM product WHERE is_archived = FALSE LIMIT ?', [limit]);
        console.log("result : ", result);

        return result;
    };

    /**
     * Retourne un tableau contenant tout les produits.
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:boolean, is_archived:boolean}[]}
     */
    async getAllProductsArchived(limit) {
        console.log("limit :", limit);
        console.log("Client get All products archived");

        const result = this.connection.execute('SELECT * FROM product WHERE is_archived = TRUE LIMIT ?', [limit]);
        console.log("result : ", result);

        return result;
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

