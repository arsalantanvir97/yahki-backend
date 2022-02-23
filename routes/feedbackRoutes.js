import express from "express";
const router = express.Router();

import {
    createFeedback,FeedbackLogs,getFeedbackDetails} from "../controllers/feedbackController";

router.post("/create-feedback",createFeedback);
router.get("/FeedbackLogs", FeedbackLogs);
router.get("/getFeedbackDetails/:id", getFeedbackDetails);



export default router;