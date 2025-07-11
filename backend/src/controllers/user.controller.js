
/**
 * Récupère tous les utilisateurs actifs
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const getAllUsersActive = (userModel) => async (req, res, next) => {
    try {
        console.log("Client gets all users");

        const limit = parseInt(req.query.limit);

        const users = await userModel.getAllUsersActive(limit);
        
        console.log("Users was sent to client");
        return res.status(200).json(users);

    } catch (error) {
        console.log("Error fetching active users",);
        next(error);
    }
};

/**
 * Récupère tous les utilisateurs archivés
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const getAllUsersArchived = (userModel) => async (req, res, next) => {
    try {
        console.log("Client gets all users archived");

        const limit = parseInt(req.query.limit);

        const users = await userModel.getAllUsersArchived(limit);
        
        console.log("Users archived was sent to client");
        return res.status(200).json(users);
    
    } catch (error) {
        console.log("Error fetching deleted users");
        next(error);
    }
};

/**
 * Récupère un utilisateur par son id
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const getUserById = (userModel) => async (req, res, next) => {
    try {
        console.log("Client get user by Id");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const user = await userModel.getUserById(id);
        
        if (user.length !== 0) {
            console.log("User was sent to client");
            return res.status(200).json(user);
        } else {
            console.log("Unknown user");
            return res.status(404).json({ msg: "Unknown user" });
        }
    } catch (error) {
        console.log("Error fetching user by ID");
        next(error);
    }
};

/**
 * Met à jour un utilisateur existant
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const updateUser = (userModel) => async (req, res, next) => {
    try {
        console.log("Client update user");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const [user] = await userModel.getUserById(id);
        
        if (!user) {
            // L'utilisateur n'existe pas !
            console.log("Unknown user");
            return res.status(404).json("Unknown user");
        }

        
        // L'utilisateur existe
        const editUser  = req.body;
        
        // Vérification de l'autorisation
        const authUser = req.user;
        if (authUser.id !== id && !authUser.is_admin) {
            console.log("Forbidden: Client can't edit this profile");
            return res.status(403).json({ msg: "Forbidden: You can't edit this profile" });
        }

        await userModel.updateUser (id, user, editUser);

        console.log({ msg: "User edited !", oldData: user, newData: editUser });
        return res.status(200).json({ msg: "User edited !", oldData: user, newData: editUser });
    } catch (error) {
        console.log("Error editing user ");
        next(error);
    }
};

/**
 * Archive (supprime logiquement) un utilisateur
 * @param {UserModel} userModel - Modèle utilisateur
 * @returns {Function} - Middleware Express
 */
export const deleteUser = (userModel) => async (req, res, next) => {
    try {
        console.log("Client delete user");

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            console.log("Wrong request param");
            return res.status(400).json({ msg: "Wrong request param" });
        }

        const [user] = await userModel.getUserById(id);
        
        if (!user) {
            // L'utilisateur n'existe pas !
            console.log("Unknown user");
            return res.status(404).json("Unknown user");
        }
        
        // Vérification de l'autorisation
        const authUser = req.user;
        if (authUser.id !== id && !authUser.is_admin) {
            console.log("Forbidden: Client can't delete this profile");
            return res.status(403).json({ msg: "Forbidden: You can't delete this profile" });
        }

        await userModel.deleteUser(id);

        console.log({ msg: "User archived !", data: user });
        return res.status(200).json({ msg: "User deleted !", data: user });
    } catch (error) {
        console.log("Error deleting user ");
        next(error);
    }
};
