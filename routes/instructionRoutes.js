import express from "express";
const router = express.Router();

import {
    createinstruction,getallinstructions,editinstruction,editinstructiontext,
    instructionlogs} from "../controllers/instructionController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createinstruction",protect,createinstruction);
router.get("/getallinstructions",getallinstructions);

router.post('/editinstruction', protect, editinstruction)
router.post('/editinstructiontext', protect, editinstructiontext)

router.get('/instructionlogs',protect, instructionlogs)


export default router;