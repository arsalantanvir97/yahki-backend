import express from "express";
const router = express.Router();

import {
    addOrderItems
} from "../controllers/orderController";

router.post("/addOrderItems",addOrderItems);


export default router;