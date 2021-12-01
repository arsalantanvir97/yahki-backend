import express from "express";
const router = express.Router();

import {
  createWishList,
  userWishList,deleteAWish
} from "../controllers/wishListController";
router.post("/createWishList", createWishList);
router.post("/userWishList", userWishList);
router.get("/deleteAWish/:id",deleteAWish);

export default router;
