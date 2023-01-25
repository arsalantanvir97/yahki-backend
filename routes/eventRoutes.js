import express from "express";
const router = express.Router();

import {
  createevents,
  geteventsdetails,
  eventslogs,
  editevents,
  userevents,
  bookevent,
  userBookings
//   getallevents,
} from "../controllers/eventsController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createevents", protect, createevents);
router.get("/geteventsdetails/:id", protect, geteventsdetails);
router.get("/eventslogs", protect,eventslogs);
router.post('/editevents', protect, editevents)
router.get('/userevents', protect, userevents)
router.post('/bookevent', protect, bookevent)
router.get('/userBookings', protect, userBookings)

// router.get("/getallevents",getallevents);


export default router;
