
/**
 * Récupère tous les produits actifs
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getAllProducts = (productModel) => async (req, res, next) => {
    try {
        console.log("Client gets all products");
        
        const limit = parseInt(req.query.limit);
        
        const products = await productModel.getAllProductsActive(limit);
        
        console.log("Products was sent to client");
        return res.status(200).json(products);
    
    } catch (error) {
        console.log("Error fetching products");
        next(error);
    }
};

/**
 * Ajoute un ou plusieurs produits
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const addProduct = (productModel) => async (req, res, next) => {
    try {
        console.log("Client add a product");
        
        const products = req.body;
        
        const result = await productModel.addProduct(products);
        
        console.log({ msg: "Product(s) created", data: result });
        return res.status(201).json({ msg: "Product(s) created", data: result });

    } catch (error) {
        console.log("Error in creation of the product");
        next(error); // Pass to error middleware
    }
};

/**
 * Récupère un produit par son id
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getProductById = (productModel) => async (req, res, next) => {
    try {
        console.log("Client get product by Id");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const product = await productModel.getProductById(id);

        if (product.length !== 0) {
            console.log("¨Product was sent to client");
            return res.status(200).json(product);
        } else {
            // Le produit n'existe pas
            console.log("¨Product not found");
            return res.status(404).json({ msg: "Product not found" });
        }
    } catch (error) {
        console.error("Error fetching product by ID:");
        next(error);
    }
};

/**
 * Récupère tous les produits archivés
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getAllArchivedProducts = (productModel) => async (req, res, next) => {
    try {
        console.log("Client gets all products archived");

        const limit = parseInt(req.query.limit);

        const products = await productModel.getAllArchivedProducts(limit);

        console.log("All products archived was sent to client");
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching archived products");
        next(error);
    }
};

/**
 * Récupère tous les nouveaux produits
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getAllNewProducts = (productModel) => async (req, res, next) => {
    try {
        console.log("Client gets all new products");

        const limit = parseInt(req.query.limit);

        const products = await productModel.getAllNewProducts(limit);

        console.log("All new products was sent to client");
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching new products");
        next(error);
    }
};

/**
 * Récupère les produits de la catégorie Homme
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getProductHomme = (productModel) => async (req, res, next) => {
    try {
        console.log("Client gets all men's products");

        const limit = parseInt(req.query.limit);

        const products = await productModel.getProductHomme(limit);

        console.log("All men's products was sent to client");
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching men's products ");
        next(error);
    }
};

/**
 * Récupère les produits de la catégorie Femme
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getProductFemme = (productModel) => async (req, res, next) => {
    try {
        console.log("Client gets all womens's products");

        const limit = parseInt(req.query.limit);

        const products = await productModel.getProductFemme(limit);

        console.log("All women's products was sent to client");
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching women's products");
        next(error);
    }
};

/**
 * Met à jour un produit existant
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const updateProduct = (productModel) => async (req, res, next) => {
    try {
        console.log("Client update product");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const [product] = await productModel.getProductById(id);

        if (!product) {
            // Le produit n'existe pas !
            console.log("Unknown Product");
            return res.status(404).json("Unknown Product");
        }

        // Le produit existe !
        const editProduct = req.body;

        await productModel.updateProduct(id, product, editProduct);

        // Je renvoi le produit au format JSON
        console.log({ msg: "Product edited !", oldData: product, newData: editProduct });
        return res.status(200).json({ msg: "Product edited !", oldData: product, newData: editProduct });
    
    } catch (error) {
        console.log("Error editing product");
        next(error);
    }
};

/**
 * Archive (supprime logiquement) un produit
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const deleteProduct = (productModel) => async (req, res, next) => {
    try {
        console.log("Client delete product");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }
        
        const product = await productModel.getProductById(id);
        
        if (!product.length) {
            console.log("Product not found");
            return res.status(404).json({ msg: "Product not found" });
        }

        await productModel.deleteProduct(id);
        console.log({ msg: "Product archived", data: product });
        return res.status(200).json({ msg: "Product archived", data: product });
    
    } catch (error) {
        console.log("Error deleting product");
        next(error);
    }
};

/**
 * Recherche des produits par nom
 * @param {ProductModel} productModel - Modèle produit
 * @returns {Function} - Middleware Express
 */
export const getSearchProduct = (productModel) => async (req, res, next) => {
    try {
        console.log("Client search product");
        const query = req.params.query;

        const products = await productModel.getSearchProduct(query);

        console.log("The product researched was sent to client");
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error searching products");
        next(error);
    }
};













