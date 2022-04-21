import express from "express";
const router = express.Router();

import {
    createDocument,getallDocuments,editDocument,
    documentlogs} from "../controllers/documentController";
import { protect } from "../middlewares/authMiddleware";

router.post("/createDocument",protect,createDocument);
router.get("/getallDocuments",getallDocuments);

router.post('/editDocument', protect, editDocument)

router.get('/documentlogs',protect, documentlogs)


export default router;