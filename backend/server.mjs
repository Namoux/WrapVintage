import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ProductModel } from "./product.model.js";
import { connection } from "./database.mjs";

const PORT = 4004;
const SECRETKEY = process.env.SECRETKEY ?? "12345";

async function main() {

    // // Je me connecte au serveur MariaDB
    // const connection = await mariadb.createConnection({
    //     host: "localhost",
    //     port: 3306,
    //     user: "root",
    //     password: "root",
    //     database: "my_back" // Je précise le nom de la bdd faites plus haut
    // });


    // await connection.execute(`
    //     CREATE TABLE IF NOT EXISTS product (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         name VARCHAR(255) NOT NULL,
    //         description VARCHAR(255) NOT NULL,
    //         price FLOAT NOT NULL,
    //         catgoryId INT NOT NULL
    //     )
    // `);
    // console.log("Table product created");

    // await connection.execute(`
    //     CREATE TABLE IF NOT EXISTS user (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         username VARCHAR(255) UNIQUE,
    //         password VARCHAR(255)
    //     )
    // `);
    // console.log("Table user created");

    const Product = new ProductModel(connection);

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.get("/all-products/:limit", async (req, res) => {

        const productLimit = parseInt(req.params.limit);

        if (isNaN(productLimit)) {
            res.status(400).json({ msg: "Wrong request param" });
            return;
        }
        const products = await Product.getAllProducts(productLimit);

        console.log("products : ", products);

        if (productLimit.length != 0) {
            res.status(200).json(products);
        } else {
            // Les produits n'existent pas !
            res.status(400).json("Unknow Products");

        }
    });

    app.get("/product/:id", async (req, res) => {

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
            res.status(400).json("Unknow Product");
        }
    });

    app.post("/new-product", checkTokenValid, async (req, res) => {

        try {
            const newProducts = req.body;

            if (newProducts.length == undefined) {
                connection.execute(`INSERT INTO product (name, description, price, categoryId) VALUES ('${newProducts.name}', '${newProducts.description}', '${newProducts.price}', '${newProducts.categoryId}')`);
            } else {
                newProducts.forEach((newProduct) => {
                    connection.execute(`INSERT INTO product (name, description, price, categoryId) VALUES ('${newProduct.name}', '${newProduct.description}', '${newProduct.price}', '${newProduct.categoryId}')`);
                });
            }

            res.status(200).json({ msg: "Product created", data: newProducts });
            console.log("Product created : ", newProducts);

        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        };
    });

    app.put("/edit-product/:id", async (req, res) => {

        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({ msg: "Wrong request param" });
            return;
        }

        const product = await Product.getProductById(productId);

        try {
            if (product.length != 0) {
                // Le produit existe !
                const editProduct = req.body;
                console.log("editProduct :", editProduct);

                for await (const [key, value] of Object.entries(editProduct)) {
                    console.log(`${key}: ${value}`);
                    connection.execute(`UPDATE product 
                    SET ${key} = '${value}'  
                    WHERE id = '${productId}'
                    `);
                };

                // Je renvoi le produit au format JSON
                res.status(200).json({ msg: "Product edited !", data: product });
                console.log({ msg: "Product edited !", data: product });
            } else {
                // Le produit n'existe pas !
                res.statusCode = 404;
                res.json("Unknow Product");
            }
        } catch (error) {
            res.status(400).json({ msg: "Wrong request" });
            console.log("Wrong request of client");
            return;
        };
    });

    app.delete("/product/:id", async (req, res) => {

        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({ msg: "Wrong request param" });
            return;
        }

        const product = await Product.getProductById(productId);

        if (product.length != 0) {
            // Le produit existe !
            // Je renvoi le produit au format JSON
            await connection.execute(`DELETE FROM product WHERE id = ${productId}`);
            res.json({ msg: "Product deleted", data: product });
            console.log({ msg: "Product deleted", data: product });
        } else {
            // Le produit n'existe pas !
            res.statusCode = 404;
            res.json("Unknow Product");
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
                return res.status(400).json({ error: "Unauthorized" });
            };

            const user = users[0];
            console.log("user", user);

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
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
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Créer un nouvelle utilisateur
    app.post("/signup", async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                console.log('Username and password are required');
                return res.status(400).json({ error: 'Username and password are required' });
            };

            const hashPassword = await bcrypt.hash(password, 10);
            const insertResult = await connection.execute(
                'INSERT INTO user (username, password) VALUES (?, ?)',
                [username, hashPassword]
            );

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



