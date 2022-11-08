import express from "express";
const router = express.Router();

import {
  createfaqs,
  getfaqsdetails,
  faqslogs,
  editfaqs,
  getallfaqs,
  faqvideo
} from "../controllers/faqsController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createfaqs", protect, createfaqs);
router.get("/getfaqsdetails/:id", protect, getfaqsdetails);
router.get("/faqslogs", protect,faqslogs);
router.post('/editfaqs', protect, editfaqs)
router.get("/getallfaqs",getallfaqs);
router.post('/faqvideo', faqvideo)


export default router;
