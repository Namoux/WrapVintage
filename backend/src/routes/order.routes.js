import express from 'express';
import { OrderModel } from '../models/order.model.js';
import { getLastOrder, getAllOrders, getOrderById} from '../controllers/order.controller.js';
import { checkTokenValid } from '../middlewares/auth.middleware.js';


const orderRoutes = (connection) => {
    const router = express.Router();
    const orderModel = new OrderModel(connection);

    router.get('/last/:userId', checkTokenValid, getLastOrder(orderModel));
    router.get('/all/:userId', checkTokenValid, getAllOrders(orderModel));
    router.get('/:orderId', checkTokenValid, getOrderById(orderModel));
    
    return router;
};

export default orderRoutes;