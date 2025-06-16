import mariadb from "mariadb";

// Je me connecte au serveur MariaDB
export const connection = await mariadb.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "shop" // Je précise le nom de la bdd 
});

const product = await connection.execute(`
    CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        imageURL VARCHAR(255),
        quantity INT NOT NULL,
        is_new BOOLEAN DEFAULT FALSE,
        is_archived BOOLEAN DEFAULT FALSE
    )
`);
if (product.warningStatus === 0) console.log("Table product created");

const user = await connection.execute(`
    CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NULL UNIQUE,
        password VARCHAR(100) NULL,
        email VARCHAR(100) NULL UNIQUE,
        is_admin BOOLEAN DEFAULT FALSE, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL
    )
`);
if (user.warningStatus === 0) console.log("Table user created");

const category = await connection.execute(`
    CREATE TABLE IF NOT EXISTS category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
        )
`);
if (category.warningStatus === 0) console.log("Table category created");

const productCategory = await connection.execute(`
    CREATE TABLE IF NOT EXISTS productCategory (
        fk_product INT,
        fk_category INT,
        PRIMARY KEY (fk_product, fk_category),
        FOREIGN KEY (fk_product) REFERENCES product(id),
        FOREIGN KEY (fk_category) REFERENCES category(id) ON DELETE CASCADE
        )
`);
if (productCategory.warningStatus === 0) console.log("Table productCategory created");

const cart = await connection.execute(`
    CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    )
`);
if (cart.warningStatus === 0) console.log("Table cart created");

const productCart = await connection.execute (`
    CREATE TABLE IF NOT EXISTS productCart (
        fk_product INT,
        fk_cart INT,
        quantity INT NOT NULL,
        PRIMARY KEY (fk_product, fk_cart),
        FOREIGN KEY (fk_product) REFERENCES product(id),
        FOREIGN KEY (fk_cart) REFERENCES cart(id) ON DELETE CASCADE
    )
`);
if (productCart.warningStatus === 0) console.log("Table productCart created");

const orders = await connection.execute (`
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id)
    )
`);
if (orders.warningStatus === 0) console.log("Table orders created");

const productOrder = await connection.execute (`
    CREATE TABLE IF NOT EXISTS productOrder (
        fk_product INT,
        fk_order INT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        PRIMARY KEY (fk_product, fk_order),
        FOREIGN KEY (fk_product) REFERENCES product(id),
        FOREIGN KEY (fk_order) REFERENCES orders(id)
    )
`);
if (productOrder.warningStatus === 0) console.log("Table productOrder created");

