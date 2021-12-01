import express from "express";
const router = express.Router();

import {
    createProduct,getproducts,getProductDetails,detoxProducts,productlogs,productbycategorylogs,getlimitedProducts
} from "../controllers/productController";
router.post("/createProduct",createProduct);
router.get("/getproducts",getproducts);
router.get("/getProductDetails/:id", getProductDetails);
router.get("/getlimitedProducts",getlimitedProducts);

router.post("/detoxProducts",detoxProducts);
router.get("/productlogs",productlogs);
router.get("/productbycategorylogs/:id",productbycategorylogs);


export default router