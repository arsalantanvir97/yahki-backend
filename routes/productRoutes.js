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
  editProduct,
  getproductsbycategoryid,
  geoGeneticslogs,
  productsbycategoryid,
  getProductDetailsByName,
  geoGeneticsProducts,
  searchProductlogs,
  bittersandElementProducts
} from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createProduct", protect, createProduct);
router.get("/getproducts", getproducts);
router.get("/getProductDetails/:id", getProductDetails);
router.get("/getProductDetailsByName/:id", getProductDetailsByName);
router.get("/getlimitedProducts", getlimitedProducts);
router.get("/toggle-active/:id", protect, toggleActiveStatus);
router.get("/detoxProducts", detoxProducts);
router.get("/geoGeneticsProducts", geoGeneticsProducts);
router.post("/editProduct", protect,editProduct);
router.get("/productlogs", productlogs);
router.get("/productlogsofAdmin", productlogsofAdmin);
router.get("/geoGeneticslogs", geoGeneticslogs);
router.get('/deleteProduct/:id', protect, deleteProduct)
router.get('/getproductsbycategoryid/:id', getproductsbycategoryid)
router.get('/productsbycategoryid', productsbycategoryid)
router.get("/productbycategorylogs/:id", productbycategorylogs);
router.post('/searchProductlogs', searchProductlogs)
router.get('/bittersandElementProducts', bittersandElementProducts)

export default router;
