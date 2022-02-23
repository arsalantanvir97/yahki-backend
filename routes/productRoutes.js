import express from "express";
const router = express.Router();

import {
  createProduct,
  getproducts,
  getProductDetails,
  detoxProducts,
  productlogs,
  productbycategorylogs,
  getlimitedProducts,
  productlogsofAdmin,
  toggleActiveStatus,
  deleteProduct,
  editProduct
} from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createProduct", protect, createProduct);
router.get("/getproducts", getproducts);
router.get("/getProductDetails/:id", getProductDetails);
router.get("/getlimitedProducts", getlimitedProducts);
router.get("/toggle-active/:id", protect, toggleActiveStatus);

router.post("/detoxProducts", detoxProducts);
router.post("/editProduct", protect,editProduct);


router.get("/productlogs", productlogs);
router.get("/productlogsofAdmin", productlogsofAdmin);
router.get('/deleteProduct/:id', protect, deleteProduct)


router.get("/productbycategorylogs/:id", productbycategorylogs);

export default router;
