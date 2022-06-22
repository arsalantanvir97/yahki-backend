import express from "express";
const router = express.Router();

import {
    createinstruction,getallinstructions,editinstruction,
    instructionlogs} from "../controllers/instructionController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createinstruction",protect,createinstruction);
router.get("/getallinstructions",getallinstructions);

router.post('/editinstruction', protect, editinstruction)

router.get('/instructionlogs',protect, instructionlogs)


export default router;