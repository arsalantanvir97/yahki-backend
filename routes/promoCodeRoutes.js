import express from "express";
const router = express.Router();
import {
  createPromoCode,
  getAllPromoCode,
  applypromocode,
  PromoCodeLogs,
  toggleActiveStatus,
  promoCodeDetails,
  editPromoCOde
} from "../controllers/promoCodeController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createPromoCode", protect, createPromoCode);
router.get("/getAllPromoCode", protect, getAllPromoCode);
router.post("/applypromocode", protect, applypromocode);
router.get("/PromoCodeLogs", protect, PromoCodeLogs);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/promoCodeDetails/:id", protect, promoCodeDetails);
router.post("/editPromoCOde", protect, editPromoCOde);


export default router;
