import express from "express";
const router = express.Router();
import {
  createDispute,
//   getAllDispute,
//   applyDispute,
  DisputeLogs,getDisputeDetails
//   toggleActiveStatus,
//   DisputeDetails,
//   editDispute
} from "../controllers/DisputeController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createDispute", protect, createDispute);
// router.get("/getAllDispute", protect, getAllDispute);
// router.post("/applyDispute", protect, applyDispute);
router.get("/DisputeLogs", protect, DisputeLogs);
// router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/getDisputeDetails/:id", protect, getDisputeDetails);
// router.post("/editDispute", protect, editDispute);


export default router;
