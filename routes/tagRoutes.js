import express from 'express'
const router = express.Router()

import {
  createtag,
  edittag,
  taglogs,
  gettagdetails,
  gettalltags
} from '../controllers/tagController'
import { protect } from '../middlewares/authMiddleware'

router.post('/createtag', protect, createtag)
router.post('/edittag', protect, edittag)
router.get('/gettagdetails/:id', protect, gettagdetails)

router.get('/taglogs', taglogs)
router.get('/gettalltags', gettalltags)

export default router
