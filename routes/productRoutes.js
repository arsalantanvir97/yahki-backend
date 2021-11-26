import express from "express";
const router = express.Router();

import {
    createProduct,getproducts,getProductDetails
} from "../controllers/productController";
router.post("/createProduct",createProduct);
router.get("/getproducts",getproducts);
router.get("/getProductDetails/:id", getProductDetails);



export default router