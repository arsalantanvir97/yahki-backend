import express from "express";
const router = express.Router();

import {
  createWishList,
  userWishList,deleteAWish
} from "../controllers/wishListController";
import { protect } from "../middlewares/authMiddleware";
router.post("/createWishList", protect,createWishList);
router.get("/userWishList",protect, userWishList);
router.get("/deleteAWish/:id",protect,deleteAWish);

export default router;
