
/**
 * Récupère toutes les catégories
 * @param {CategoryModel} categoryModel - Modèle catégorie
 * @returns {Function} - Middleware Express
 */
export const getAllCategories = (categoryModel) => async (req, res, next) => {
    try {
        console.log("Client gets all categories");

        const limit = parseInt(req.query.limit);

        const categories = await categoryModel.getAllCategories(limit);

        console.log("Categories was sent to client");
        return res.status(200).json(categories);
    } catch (error) {
        console.log("Error fetching categories");
        next(error);
    }
};

/**
 * Récupère une catégorie par son id
 * @param {CategoryModel} categoryModel - Modèle catégorie
 * @returns {Function} - Middleware Express
 */
export const getCategoryById = (categoryModel) => async (req, res, next) => {
    try {
        console.log("Client get category by Id");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const category = await categoryModel.getCategoryById(id);

        if (category.length !== 0) {
            // La catégorie existe
            console.log("Category was sent to client");
            return res.status(200).json(category);
        } else {
            // La catégorie n'existe pas !
            console.log("Unknown category");
            return res.status(400).json("Unknown category");
        }
    } catch (error) {
        console.log("Error fetching the category");
        next(error);
    }
};

/**
 * Ajoute une nouvelle catégorie
 * @param {CategoryModel} categoryModel - Modèle catégorie
 * @returns {Function} - Middleware Express
 */
export const addCategory = (categoryModel) => async (req, res, next) => {
    try {
        console.log("client add a category");

        const newCategory = req.body;

        const result = await categoryModel.addCategory(newCategory);

        console.log("Category created:", result);
        return res.status(200).json({ msg: "Category created", data: result });
    } catch (error) {
        console.log("Error in creation of the category");
        next(error);
    }
};

/**
 * Met à jour une catégorie existante
 * @param {CategoryModel} categoryModel - Modèle catégorie
 * @returns {Function} - Middleware Express
 */
export const updateCategory = (categoryModel) => async (req, res, next) => {
    try {
        console.log("Client update category");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const [category] = await categoryModel.getCategoryById(id);

        if (!category) {
            // Le catégorie n'existe pas !
            console.log("Unknown Category");
            return res.status(404).json("Unknown Category");
        }

        // la categorie existe
        const editCategory = req.body;

        await categoryModel.updateCategory(id, category, editCategory);

        // Je renvoi les changements au format JSON
        console.log({ msg: " Category edited !", oldData: category, newData: editCategory });
        return res.status(200).json({ msg: "Category edited !", oldData: category, newData: editCategory });
    } catch (error) {
        console.log("Wrong request of client");
        next(error);
    }
};

/**
 * Supprime une catégorie
 * @param {CategoryModel} categoryModel - Modèle catégorie
 * @returns {Function} - Middleware Express
 */
export const deleteCategory = (categoryModel) => async (req, res, next) => {
    try {
        console.log("Client delete category");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const category = await categoryModel.getCategoryById(id);

        if (category.length !== 0) {
            // La categorie existe et on le supprime!
            await categoryModel.deleteCategory(id);

            // Je renvoi la confirmation au format JSON
            console.log({ msg: "Category deleted", data: category });
            return res.status(200).json({ msg: "Category deleted", data: category });
        } else {
            // Le produit n'existe pas !
            console.log("Unknown Category");
            return res.status(404).json("Unknown Category");
        }
    } catch (error) {
        console.log("Wrong request of client");
        next(error);
    }
};
