import express from "express";
const router = express.Router();

import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  orderlogs,
  logs,
  updateOrderToDelivered,
  getCountofallCollection,
  getLatestOrders,
  addGeoGeneticsOrderItems,
  geoGeneticslogs
} from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

router.post("/addOrderItems", addOrderItems);
router.post("/addGeoGeneticsOrderItems", addGeoGeneticsOrderItems);

router.get("/getOrderById/:id", getOrderById);
router.put("/:id/pay", updateOrderToPaid);
router.post("/updateOrderToDelivered/:id", protect, updateOrderToDelivered);
router.get("/orderlogs/:id", orderlogs);
router.get("/logs", logs);
router.get("/geoGeneticslogs", geoGeneticslogs);

router.get("/getLatestOrders", protect, getLatestOrders);

router.get("/getCountofallCollection", protect, getCountofallCollection);

export default router;
