
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
     * @returns {{id:number,name:string, description:string, price:number, imageURL:string, quantity:number, is_new:Boolean}[]}
     */
    async getAllProducts(limit) {
        console.log("limit :", limit);
        console.log("Client get All products");

        const result = this.connection.execute(`SELECT * FROM product LIMIT ${limit}`);
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

        const result = await this.connection.execute('SELECT * FROM category WHERE id = ?', [id]);
        console.log("result : ", result);

        return result;
    };

    
}

