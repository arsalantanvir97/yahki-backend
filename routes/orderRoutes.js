import express from "express";
const router = express.Router();

import {
    addOrderItems,getOrderById,updateOrderToPaid,orderlogs,
} from "../controllers/orderController";

router.post("/addOrderItems",addOrderItems);
router.get("/getOrderById/:id",getOrderById);
router.put("/:id/pay",updateOrderToPaid);
router.get("/orderlogs/:id",orderlogs);



export default router;