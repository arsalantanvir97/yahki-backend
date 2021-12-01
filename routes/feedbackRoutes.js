import express from "express";
const router = express.Router();

import {
    createFeedback,} from "../controllers/feedbackController";

router.post("/create-feedback",createFeedback);



export default router;