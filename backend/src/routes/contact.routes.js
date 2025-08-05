import express from 'express';
import { ContactModel } from '../models/contact.model.js';
import { sendContactMessage } from '../controllers/contact.controller.js';

const contactRoutes = (connection) => {
    const router = express.Router();
    const contactModel = new ContactModel(connection);

    router.post('/', sendContactMessage(contactModel));
    // Pour l'admin : router.get('/', ...) pour lire les messages

    return router;
};

export default contactRoutes;