import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connection } from "./database.mjs";
import { errorHandler } from "./middlewares/error.middleware.js";
import { PORT, HOST, CLIENT_URL } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import cookieParser from 'cookie-parser';
import stripeRoutes from './routes/stripe.routes.js';
import orderRoutes from './routes/order.routes.js';
import contactRoutes from './routes/contact.routes.js';

// const baseUrl = `${HOST}:${PORT}`;
const baseUrl = `${HOST}`; // Utiliser une variable d'environnement pour l'Url

const app = express();

// Middleware sécurité CSP
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "https://js.stripe.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      "font-src": ["'self'", "https://cdnjs.cloudflare.com"],
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'", "https://api.stripe.com"],
      "frame-src": ["https://js.stripe.com"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"]
    }
  }
}));

// route Stripe avant express.json (webhook a besoin du RAW sans intercepteur JSON global)
app.use("/api/stripe", stripeRoutes(connection, baseUrl));
app.use('/stripe', stripeRoutes(connection, baseUrl));

app.use(express.json());
app.use(cors({
    origin: `${CLIENT_URL}`, // frontend Angular
    credentials: true                // autorise les cookies
}));
app.use(cookieParser());
app.use(express.static('public')); // Dossier pour les fichiers statiques

// Routes
app.use("/products", productRoutes(connection, baseUrl));
app.use("/users", userRoutes(connection));
app.use("/categories", categoryRoutes(connection));
app.use("/auth", authRoutes(connection, baseUrl));
app.use("/cart", cartRoutes(connection, baseUrl));
app.use('/orders', orderRoutes(connection));
app.use('/api/contact', contactRoutes(connection));

// Handle 404 as default route
app.use((req, res) => {
    console.log(`❌ 404 - ${req.method} ${req.originalUrl}`);
    res.status(404).json({ msg: "Page Not Found" });
});

// Gestion des erreurs
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server listening on ${baseUrl}`);
});
