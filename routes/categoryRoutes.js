import express from "express";
const router = express.Router();

import {
  createCategory,
  CategoryLogs,
  toggleActiveStatus,
  getCategoryDetails,
  editCategory,
  allOfCategories,
  getCategoryDetailsanditsProduct,getGeoGeneticsCategory
} from "../controllers/categoryController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createCategory", protect, createCategory);
router.get("/CategoryLogs", protect, CategoryLogs);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/getCategoryDetails/:id", protect, getCategoryDetails);
router.get(
  "/getCategoryDetailsanditsProduct/:id",
  protect,
  getCategoryDetailsanditsProduct
);
router.post("/editCategory", protect, editCategory);
router.get("/allOfCategories", allOfCategories);
router.get("/getGeoGeneticsCategory",protect, getGeoGeneticsCategory);

export default router;
