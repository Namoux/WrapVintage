import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ProductModel } from "./product.model.js";
import { connection } from "./database.mjs";

const PORT = 4004;
const SECRETKEY = process.env.SECRETKEY;

async function main() {

    const Product = new ProductModel(connection);

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.get("/all-products/:limit", async (req, res) => {
        try {
            const productLimit = parseInt(req.params.limit);
    
            if (isNaN(productLimit)) {
                res.status(400).json({ msg: "Wrong request param" });
                return;
            }
            const products = await Product.getAllProductsActive(productLimit);
    
            console.log("products : ", products);
    
            if (productLimit.length != 0) {
                res.status(200).json(products);
            } else {
                // Les produits n'existent pas !
                res.status(400).json("Unknown products");
    
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            console.error("Error :", error);
            return;
        }
    });

    app.get("/all-products-archived/:limit", checkTokenAdmin(connection), async (req, res) => {
        try {
            const productLimit = parseInt(req.params.limit);
    
            if (isNaN(productLimit)) {
                res.status(400).json({ msg: "Wrong request param" });
                return;
            }
            const products = await Product.getAllProductsArchived(productLimit);
    
            console.log("products : ", products);
    
            if (productLimit.length != 0) {
                res.status(200).json(products);
            } else {
                // Les produits n'existent pas !
                res.status(400).json("Unknown products");
    
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            console.error("Error :", error);
            return;
        }
    });

    app.get("/product/:id", async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                res.status(400).json({ msg: "Wrong request param" });
                return;
            }
            const product = await Product.getProductById(productId);
            console.log("product : ", product);
    
    
            if (product.length != 0) {
                res.status(200).json(product);
            } else {
                // Le produit n'existe pas !
                res.status(400).json("Unknown product");
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        }
    });

    app.post("/add-product", checkTokenAdmin(connection), async (req, res) => {
        try {
            const newProducts = req.body;

            const categories = await connection.execute('SELECT * FROM category');
            
            if (newProducts.length == undefined) {
                const categoryExists = categories.find(cat => cat.id === newProducts.categoryId);
                if (!categoryExists) {
                    console.log("Categorie doesn't exist");
                    res.status(400).json({ msg: "Categorie doesn't exist" });
                    return;
                } else {
                    if (newProducts.is_new == undefined) {
                        connection.execute('INSERT INTO product (name, description, price, imageURL, quantity) VALUES (?,?,?,?,?)', [newProducts.name, newProducts.description, newProducts.price, newProducts.imageURL, newProducts.quantity]);
                    } else {
                        connection.execute('INSERT INTO product (name, description, price, imageURL, quantity, is_new) VALUES (?,?,?,?,?,?)', [newProducts.name, newProducts.description, newProducts.price, newProducts.imageURL, newProducts.quantity, newProducts.is_new]);
                    }
                        
                        const [productCreated] = await connection.execute('SELECT MAX(id) AS lastId FROM product');
                        connection.execute('INSERT INTO productCategory (fk_product, fk_category) VALUES (?,?)', [productCreated.lastId, newProducts.categoryId]);
                    }
            } else {
                for (const newProduct of newProducts) {
                    const categoryExists = categories.find(cat => cat.id === newProduct.categoryId);
                    if (!categoryExists) {
                        console.log("Categorie doesn't exist");
                        res.status(400).json({ msg: "Categorie doesn't exist" });
                        return;
                    }

                    if(newProduct.is_new == undefined) {
                        connection.execute('INSERT INTO product (name, description, price, imageURL, quantity) VALUES (?,?,?,?,?)', [newProduct.name, newProduct.description, newProduct.price, newProduct.imageURL, newProduct.quantity]);
                    } else {
                        connection.execute('INSERT INTO product (name, description, price, imageURL, quantity, is_new) VALUES (?,?,?,?,?,?)', [newProduct.name, newProduct.description, newProduct.price, newProduct.imageURL, newProduct.quantity, newProduct.is_new]);
                    }
                        
                    const [productCreated] = await connection.execute('SELECT MAX(id) AS lastId FROM product');
                    connection.execute('INSERT INTO productCategory (fk_product, fk_category) VALUES (?,?)', [productCreated.lastId, newProduct.categoryId]);
                }
            }
                    
            res.status(200).json({ msg: "Product created", data: newProducts });
            console.log("Product created : ", newProducts);
            

        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        };
    });

    app.put("/edit-product/:id", checkTokenAdmin(connection), async (req, res) => {

        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({ msg: "Wrong request param" });
            console.log("Wrong request param");
            return;
        };

        const [product] = await Product.getProductById(productId);
        const categories = await Product.getAllCategory();

        try {
            if (product.length != 0) {
                // Le produit existe !
                const editProduct = req.body;
                console.log("editProduct :", editProduct);

                for await (const [key, value] of Object.entries(editProduct)) {
                    if (key in product) {
                        connection.execute(`UPDATE product SET ${key} = ? WHERE id = ?`, [value, productId]);
                        // some renvoi true si la value existe dans category id
                    } else if (key === "categoryId" && categories.some(cat => cat.id === Number(value))){
                        connection.execute('UPDATE productCategory SET fk_category = ? WHERE fk_product = ?', [value, productId]);
                    } else {
                        console.log("key", key);
                        res.status(400).json({ msg: "Wrong params" });
                        console.log("Wrong params of client");
                        return;
                    }
                };

                // Je renvoi le produit au format JSON
                res.status(200).json({ msg: "Product edited !", oldData: product, newData: editProduct });
                console.log({ msg: "Product edited !", oldData: product, newData: editProduct });
            } else {
                // Le produit n'existe pas !
                res.statusCode = 404;
                res.json("Unknown Product");
                console.log("Unknown Product");
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        };
    });

    app.delete("/product/:id", checkTokenAdmin(connection), async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                res.status(400).json({ msg: "Wrong request param" });
                console.log("Wrong request param");
                return;
            }
    
            const product = await Product.getProductById(productId);
    
            if (product.length !== 0) {
                // Le produit existe !
                await connection.execute('UPDATE product SET is_archived = TRUE WHERE id = ?', [productId]);
                // Je renvoi le produit au format JSON
                res.json({ msg: "Product archived", data: product });
                console.log({ msg: "Product archived", data: product });
            } else {
                // Le produit n'existe pas !
                res.statusCode = 404;
                res.json("Unknown Product");
                console.log("Unknown Product");
            };
            
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            console.error("Error deleting product:", error);
            return;
        }
    });

    app.post("/add-category", checkTokenAdmin(connection), async (req, res) => {
        try {
            const newCategory = req.body;
            console.log(newCategory);

            if (newCategory.length == undefined) {
                connection.execute('INSERT INTO category (name) VALUES (?)', [newCategory.name]);
            } else {
                newCategory.forEach((oneCategory) => {
                    connection.execute('INSERT INTO category (name) VALUES (?)', [oneCategory.name]);
                })
            }
     
            res.status(200).json({ msg: "Category created", data: newCategory });
            console.log("Category created : ", newCategory);
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        }
    });

    app.put("/edit-category/:id", checkTokenAdmin(connection), async (req, res) => {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            res.status(400).json({msg: "Wrong request param"});
            console.log("Wrong request param");
            return;
        };

        const [category] = await Product.getCategoryById(categoryId);

        try {
            if (category.length != 0) {
                // la categorie existe
                const editCategory = req.body;
                console.log("editCategory : ", editCategory);

                for await (const [key, value] of Object.entries(editCategory)) {
                    if (key in category) {
                        // console.log(key, value);
                        connection.execute(`UPDATE category SET ${key} = ? WHERE id = ?`, [value, categoryId]);
                    } else {
                        console.log("key", key);
                        res.status(400).json({ msg: "Wrong params" });
                        console.log("Wrong params of client");
                        return;
                    }
                };

                // Je renvoi le produit au format JSON
                res.status(200).json({ msg: "Category edited !", oldData: category, newData: editCategory });
                console.log({ msg: " Category edited !", oldData: category, newData: editCategory });
            } else {
                // Le produit n'existe pas !
                res.statusCode = 404;
                res.json("Unknown Category");
                console.log("Unknown Category");
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        }

    });

    app.delete("/category/:id", checkTokenAdmin(connection), async (req, res) => {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            res.status(400).json({msg: "Wrong request param"});
            console.log("Wrong request param");
            return;
        };

        const category = await Product.getCategoryById(categoryId);

        if (category.length != 0) {
            // La categorie existe et on le supprime!
            // await connection.execute('DELETE FROM productCategory WHERE fk_category = ?', [categoryId]);
            await connection.execute('DELETE FROM category WHERE id = ?', [categoryId]);
            // Je renvoi une reponse au format JSON
            res.json({ msg: "Category deleted", data: category });
            console.log({ msg: "Category deleted", data: category });
        } else {
            // Le produit n'existe pas !
            res.statusCode = 404;
            res.json("Unknown Category");
            console.log("Unknown Category");
        }
    });

    app.get("/all-users/:limit", checkTokenAdmin(connection), async (req, res) => {
        try {
            const userLimit = parseInt(req.params.limit);
    
            if (isNaN(userLimit)) {
                res.status(400).json({ msg: "Wrong request param" });
                return;
            }
            const users = await Product.getAllUsersActive(userLimit);
    
            console.log("users : ", users);
    
            if (userLimit.length != 0) {
                res.status(200).json(users);
            } else {
                // Les produits n'existent pas !
                res.status(400).json("Unknown users");
    
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        }
    });

    app.get("/all-users-deleted/:limit", checkTokenAdmin(connection), async (req, res) => {
        try {
            const userLimit = parseInt(req.params.limit);
    
            if (isNaN(userLimit)) {
                res.status(400).json({ msg: "Wrong request param" });
                return;
            }
            const users = await Product.getAllUsersDeleted(userLimit);
    
            console.log("users : ", users);
    
            if (userLimit.length != 0) {
                res.status(200).json(users);
            } else {
                // Les produits n'existent pas !
                res.status(400).json("Unknown users");
    
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        }
    });

    app.delete("/user/:id", checkTokenAdmin(connection), async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                res.status(400).json({msg: "Wrong request param"});
                console.log("Wrong request param");
                return;
            };
    
            const user = await Product.getUserById(userId);
    
            if (user.length != 0) {
                // l'user existe et on le supprime!
                await connection.execute('UPDATE user SET deleted_at = now(), username = NULL, password = NULL, email = NULL WHERE id = ?', [userId]);
                res.json({ msg: "Suspended account", data: user });
                console.log({ msg: "Suspended account", data: user });
            } else {
                    // Le produit n'existe pas !
                    res.statusCode = 404;
                    res.json("Unknown User");
                    console.log("Unknown User");
            };
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            console.error("Error deleting user:", error);
            return;
        }
    });

    app.put("/edit-user/:id", checkTokenValid, async (req, res) => {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            res.status(400).json({msg: "Wrong request param"});
            console.log("Wrong request param");
            return;
        };

        const [user] = await Product.getUserById(userId);

        try {
            if (user.length != 0) {
                //  le user existe 
                const editUser = req.body;
                console.log("editUser : ", editUser);

                for await (const [key, value] of Object.entries(editUser)) {
                    if (key in user) {
                        if(key === "password") {
                            const hashPassword = await bcrypt.hash(value, 10);
                            connection.execute(`UPDATE user SET ${key} = ? WHERE id = ?`, [hashPassword, userId]);
                        } else {
                            connection.execute(`UPDATE user SET ${key} = ? WHERE id = ?`, [value, userId]);
                        }
                    } else {
                        console.log("key", key);
                        res.status(400).json({ msg: "Wrong params" });
                        console.log("Wrong params of client");
                        return;
                    }
                };
                
                // Je renvoi le produit au format JSON
                res.status(200).json({ msg: "user edited !", oldData: user, newData: editUser });
                console.log({ msg: " Category edited !", oldData: user, newData: editUser });
            } else {
                // Le produit n'existe pas !
                res.statusCode = 404;
                res.json("Unknown User");
                console.log("Unknown User");
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        }
    });

    // Fournir un token au client à la connexion
    app.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                console.log("Username and password are required!");
                return res.status(400).json({ error: "Username and password are required!" });
            };

            const users = await connection.execute(`SELECT * FROM user WHERE username=?`, [username]);
            
            if (users.length < 0) {
                console.log("Unknown client");
                return res.status(400).json({ error: "Unauthorized" });
            };
            
            const user = users[0];
            console.log("user", user);

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                console.log("Unauthorized");
                return res.status(400).json({ error: "Unauthorized" });
            }

            const token = jwt.sign({
                username: user.username,
                id: user.id
            }, SECRETKEY);

            res.status(200).json({
                message: "logged in",
                token
            })
        } catch (error) {
            console.error('Error login user:', error);
            return res.status(500).json({ error: 'Error login user' });
        }
    });

    // Créer un nouvelle utilisateur
    app.post("/signup", async (req, res) => {
        try {
            const { username, password, email, is_admin } = req.body;
            if (!username || !password || !email) {
                console.log('Username, password and email are required');
                return res.status(400).json({ error: 'Username, password and email are required' });
            };

            const hashPassword = await bcrypt.hash(password, 10);

            if (is_admin === undefined) {
                const insertResult = await connection.execute(
                    'INSERT INTO user (username, password, email) VALUES (?, ?, ?)',
                    [username, hashPassword, email]
                );
            } else {
                const insertResult = await connection.execute(
                    'INSERT INTO user (username, password, email, is_admin) VALUES (?, ?, ?, ?)',
                    [username, hashPassword, email, is_admin]
                );
            }

            console.log('User created successfully');
            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            
            if (error.code == "ER_DUP_ENTRY") {
                console.log('Error creating user: User already in database');
                return res.status(400).json({ error: 'User already created' });
            } else {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    });

    // Handle 404 as default route
    app.use((req, res) => {
        res.status(404).json({ msg: "Page Not Found" });
        console.log({ msg: "Page Not Found" });
    });

    app.listen(PORT, () => {
        console.log(`Server listen on http://0.0.0.0:${PORT}`);
    });

}

main();

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
function checkTokenValid (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRETKEY);
        console.log("Token authorized");
        
        next();
    } catch (error) {
        console.log("Wrong Token");
        return res.status(401).json({
            msg : "Wrong token"
        });
    };
}

/**
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
function checkTokenAdmin (connection) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
        
            const decodeToken = jwt.verify(token, SECRETKEY)
        
            const IdUser = decodeToken.id;
    
            const resultUser = await connection.execute('SELECT * FROM user WHERE id = ?', [IdUser]);

            if (resultUser[0].is_admin === 1) {
                console.log ("Token Admin valid");
                next();
            } else {
                console.log("Acces denied, not Admin");
                return res.status(403).json({
                msg : "Acces denied, not Admin"
            });
            }

        } catch (error) {
            console.log("Wrong Token Admin");
            return res.status(401).json({
                msg : "Wrong token"
            });
        }
    }
}



