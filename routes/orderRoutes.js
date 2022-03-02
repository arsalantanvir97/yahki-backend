import express from "express";
const router = express.Router();

import {
    addOrderItems,getOrderById,updateOrderToPaid,orderlogs,logs,updateOrderToDelivered
} from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

router.post("/addOrderItems",addOrderItems);
router.get("/getOrderById/:id",getOrderById);
router.put("/:id/pay",updateOrderToPaid);
router.post("/updateOrderToDelivered/:id",protect,updateOrderToDelivered);
router.get("/orderlogs/:id",orderlogs);
router.get("/logs",logs);



export default router;