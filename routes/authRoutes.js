import express from "express";
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  registerUser,
  authUser,
  verifyAndREsetPassword,
  adminRecoverPassword,
  adminverifyRecoverCode,
  adminresetPassword,
  registerUserbyAdmin,emailLogin,registerAdminbyAdmin,adminlogs,adminDetails,deleteAdmin, userEditProfile
} from "../controllers/authController.js";
import { getVideo, uploadVideo } from "../controllers/videoController.js";
import { protect } from "../middlewares/authMiddleware";
import { extendTimeout } from "../middlewares/extendTimeout.js";

router.post("/adminRegister", registerAdmin);
router.post("/registerAdminbyAdmin", protect,registerAdminbyAdmin);


router.post("/adminAuth", authAdmin);
router.post("/userRecoverPassword", recoverPassword);
router.post("/adminRecoverPassword", adminRecoverPassword);
router.get("/adminlogs",protect, adminlogs);

router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/adminverifyRecoverCode", adminverifyRecoverCode);
router.get("/deleteAdmin/:id", deleteAdmin);


router.post("/userresetPassword", resetPassword);
router.post("/adminresetPassword", adminresetPassword);

router.get("/admin-details/:id",adminDetails);

router.post("/editProfile", editProfile);
router.post("/userEditProfile",protect, userEditProfile);


router.post("/registerUser", registerUser);
router.post("/registerUserbyAdmin",protect, registerUserbyAdmin);

router.post("/authUser", authUser);
router.post("/emailLogin", emailLogin);

router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);
router.post("/uploadVideo",extendTimeout, uploadVideo);
router.get("/getVideo", getVideo);

export default router;
