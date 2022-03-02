import express from "express";
const router = express.Router();

import {
    getallNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

router.get("/notifications",protect,getallNotification);

export default router;