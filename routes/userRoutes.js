import express from "express";
const router = express.Router();

import {
    logs,
    toggleActiveStatus,
    getUserDetails,getLatestUsers,
    editProfile,becomemeber
} from "../controllers/userController.js";
import { protect } from '../middlewares/authMiddleware'


router.get("/logs", logs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/user-details/:id",getUserDetails);
router.get("/getlatestusers", getLatestUsers);
router.post("/editProfile", editProfile);
router.post("/becomemeber",protect, becomemeber);


export default router;
