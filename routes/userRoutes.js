import express from "express";
const router = express.Router();

import {
    logs,
    toggleActiveStatus,
    getUserDetails,getLatestUsers,
    editProfile,becomemeber,
    getuserordersandwihslist
} from "../controllers/userController.js";
import { protect } from '../middlewares/authMiddleware'


router.get("/logs", logs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/user-details/:id",getUserDetails);
router.get("/getlatestusers", getLatestUsers);
router.post("/editProfile", editProfile);
router.post("/becomemeber",protect, becomemeber);
router.get("/getuserordersandwihslist",protect, getuserordersandwihslist);


export default router;
