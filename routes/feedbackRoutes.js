import express from "express";
const router = express.Router();

import {
    createFeedback,FeedbackLogs,getFeedbackDetails,deleteFeedback} from "../controllers/feedbackController";

router.post("/create-feedback",createFeedback);
router.get("/FeedbackLogs", FeedbackLogs);
router.get("/getFeedbackDetails/:id", getFeedbackDetails);
router.get("/deleteFeedback/:id", deleteFeedback);



export default router;