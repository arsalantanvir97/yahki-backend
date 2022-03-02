import express from 'express'
const router = express.Router()

import {
  createTax,
  editTax,
  taxlogs,
  deleteTax,
  gettaxdetails
} from '../controllers/taxController'
import { protect } from '../middlewares/authMiddleware'

router.post('/createTax', protect, createTax)
router.post('/editTax', protect, editTax)
router.post('/gettaxdetails', protect, gettaxdetails)

router.get('/taxlogs', taxlogs)
router.get('/deleteTax/:id', protect, deleteTax)

export default router
