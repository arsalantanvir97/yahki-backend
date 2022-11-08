import express from "express";
const router = express.Router();
import {
  createPromoCode,
  getAllPromoCode,
  applypromocode,
  PromoCodeLogs
} from "../controllers/promoCodeController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createPromoCode", protect, createPromoCode);
router.get("/getAllPromoCode", protect, getAllPromoCode);
router.post("/applypromocode", protect, applypromocode);
router.get("/PromoCodeLogs", protect, PromoCodeLogs);


export default router;
