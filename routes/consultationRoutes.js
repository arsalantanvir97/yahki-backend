import express from "express";
const router = express.Router();

import {
  createConsultation,
  logs,
  getConsultationDetails,
  updateStatus,
  userlogs
} from "../controllers/consultationController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createConsultation", protect, createConsultation);
router.get("/logs",protect, logs);
router.get("/userlogs",protect, userlogs);

router.get("/getConsultationDetails/:id",protect, getConsultationDetails);
router.post("/updateStatus/:id",protect, updateStatus);
router.get("/userlogs",protect, userlogs);


export default router;
