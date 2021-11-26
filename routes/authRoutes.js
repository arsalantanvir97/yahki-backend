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
} from "../controllers/authController.js";

router.post("/adminRegister", registerAdmin);
router.post("/adminAuth", authAdmin);
router.post("/userRecoverPassword", recoverPassword);
router.post("/userverifyRecoverCode", verifyRecoverCode);
router.post("/userresetPassword", resetPassword);
router.post("/editProfile", editProfile);
router.post("/registerUser", registerUser);
router.post("/registerVendor", registerVendor);
router.post("/authUser", authUser);

export default router;
