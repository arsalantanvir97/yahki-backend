import express from "express";
const router = express.Router();

import {
    logs,
    toggleActiveStatus,
    getUserDetails,getLatestUsers,
    editProfile
} from "../controllers/userController.js";

router.get("/logs", logs);
router.get("/toggle-active/:id",toggleActiveStatus);
router.get("/user-details/:id",getUserDetails);
router.get("/getlatestusers", getLatestUsers);
router.post("/editProfile", editProfile);


export default router;
