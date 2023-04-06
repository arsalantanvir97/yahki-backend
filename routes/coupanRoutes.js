import express from "express";
const router = express.Router();
import {
  createCoupan,
//   getAllCoupan,
//   applyCoupan,
  CoupanLogs,
//   toggleActiveStatus,
//   CoupanDetails,
//   editCoupan
} from "../controllers/CoupanController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCoupan", protect, createCoupan);
// router.get("/getAllCoupan", protect, getAllCoupan);
// router.post("/applyCoupan", protect, applyCoupan);
router.get("/CoupanLogs", protect, CoupanLogs);
// router.get("/toggle-active/:id", protect, toggleActiveStatus);
// router.get("/CoupanDetails/:id", protect, CoupanDetails);
// router.post("/editCoupan", protect, editCoupan);


export default router;
