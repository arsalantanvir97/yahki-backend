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
  registerVendor,
  verifyAndREsetPassword,
  adminRecoverPassword,
  adminverifyRecoverCode,
  adminresetPassword
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware";

router.post("/adminRegister", registerAdmin);
router.post("/adminAuth", authAdmin);
router.post("/userRecoverPassword", recoverPassword);
router.post("/adminRecoverPassword", adminRecoverPassword);

router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/adminverifyRecoverCode", adminverifyRecoverCode);


router.post("/userresetPassword", resetPassword);
router.post("/adminresetPassword", adminresetPassword);


router.post("/editProfile", editProfile);
router.post("/registerUser", registerUser);
router.post("/registerVendor", registerVendor);
router.post("/authUser", authUser);
router.post("/verifyAndREsetPassword", protect, verifyAndREsetPassword);

export default router;
