import express from "express";
const router = express.Router();

import {
    createDocument,getallDocuments} from "../controllers/documentController";

router.post("/createDocument",createDocument);
router.get("/getallDocuments",getallDocuments);



export default router;