import express from "express";
const router = express.Router();

import {
    createProduct,getproducts,getProductDetails,detoxProducts,productlogs
} from "../controllers/productController";
router.post("/createProduct",createProduct);
router.get("/getproducts",getproducts);
router.get("/getProductDetails/:id", getProductDetails);

router.get("/detoxProducts",detoxProducts);
router.get("/productlogs",productlogs);


export default router