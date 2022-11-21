import express from "express";
const router = express.Router();

import {
    getallNotification,usernotifications
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

router.get("/notifications",protect,getallNotification);
router.get("/usernotifications",protect,usernotifications);

export default router;