import express from 'express'
const router = express.Router()

import {
  createdoctorcategory,
  editdoctorcategory,
  doctorcategorylogs,
  getdoctorcategorydetails,
  gettalldoctorcategorys
} from '../controllers/doctorcategoryController'
import { protect } from '../middlewares/authMiddleware'

router.post('/createdoctorcategory', protect, createdoctorcategory)
router.post('/editdoctorcategory', protect, editdoctorcategory)
router.get('/getdoctorcategorydetails/:id', protect, getdoctorcategorydetails)

router.get('/doctorcategorylogs', doctorcategorylogs)
router.get('/gettalldoctorcategorys', gettalldoctorcategorys)

export default router
