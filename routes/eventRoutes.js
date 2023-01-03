import express from "express";
const router = express.Router();

import {
  createevents,
  geteventsdetails,
  eventslogs,
  editevents,
//   getallevents,
} from "../controllers/eventsController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createevents", protect, createevents);
router.get("/geteventsdetails/:id", protect, geteventsdetails);
router.get("/eventslogs", protect,eventslogs);
router.post('/editevents', protect, editevents)
// router.get("/getallevents",getallevents);


export default router;
