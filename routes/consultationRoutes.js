import express from "express";
const router = express.Router();

import {
  createConsultation,
  logs,
  getConsultationDetails
} from "../controllers/consultationController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createConsultation", protect, createConsultation);
router.get("/logs",protect, logs);
router.get("/getConsultationDetails/:id",protect, getConsultationDetails);


export default router;
