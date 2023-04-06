import express from "express";
const router = express.Router();

import {getInstructionDetails,
    createinstruction,getallinstructions,editinstruction,editinstructiontext,
    instructionlogs,
    editeattolivetext} from "../controllers/instructionController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createinstruction",protect,createinstruction);
router.get("/getallinstructions",getallinstructions);

router.post('/editinstruction', protect, editinstruction)
router.post('/editinstructiontext', protect, editinstructiontext)
router.post('/editeattolivetext', protect, editeattolivetext)

router.get('/instructionlogs',protect, instructionlogs)
router.get("/getInstructionDetails/:id", getInstructionDetails);


export default router;