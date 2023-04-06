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
  addGeoGeneticsOrderItems,editgeogeneticstext,
  geoGeneticslogs,
  savepaymentinfo,
  overviewdata,
  revenuedata,
  ordersummaryrevenue,
  categoriesummary,nogeoorderlogs,
  analysisproducts,
  topCategoriestemsSold
} from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

router.post("/addOrderItems",protect, addOrderItems);
router.post("/addGeoGeneticsOrderItems",protect, addGeoGeneticsOrderItems);

router.get("/getOrderById/:id", getOrderById);
router.put("/:id/pay", updateOrderToPaid);
router.post("/updateOrderToDelivered/:id", protect, updateOrderToDelivered);
router.get("/orderlogs/:id", orderlogs);
router.get("/logs", logs);
router.get("/nogeoorderlogs", nogeoorderlogs);
router.get("/analysisproducts", analysisproducts);


router.get("/geoGeneticslogs", geoGeneticslogs);

router.get("/getLatestOrders", protect, getLatestOrders);
router.post("/editgeogeneticstext", protect, editgeogeneticstext);


router.get("/getCountofallCollection", protect, getCountofallCollection);
router.post("/savepaymentinfo", protect, savepaymentinfo);
router.get("/overviewdata", protect, overviewdata);
router.get("/revenuedata", protect, revenuedata);
router.get("/ordersummaryrevenue", protect, ordersummaryrevenue);
router.get("/categoriesummary", protect, categoriesummary);
router.get("/topCategoriestemsSold", protect, topCategoriestemsSold);



export default router;
