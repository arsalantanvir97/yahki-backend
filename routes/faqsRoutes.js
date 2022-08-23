import express from "express";
const router = express.Router();

import {
  createfaqs,
  getfaqsdetails,
  faqslogs,
  editfaqs,
  getallfaqs
} from "../controllers/faqsController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createfaqs", protect, createfaqs);
router.get("/getfaqsdetails/:id", protect, getfaqsdetails);
router.get("/faqslogs", protect,faqslogs);
router.post('/editfaqs', protect, editfaqs)
router.get("/getallfaqs",getallfaqs);


export default router;
