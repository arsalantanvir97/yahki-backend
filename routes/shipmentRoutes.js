import express from "express";
const router = express.Router();

import {
  createShipment,
  getshipmentdetails,
  shipmentlogs
} from "../controllers/shipmentController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createShipment", protect, createShipment);
router.get("/getshipmentdetails/:id", protect, getshipmentdetails);
router.get("/shipmentlogs", protect,shipmentlogs);

export default router;
