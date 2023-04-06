import express from 'express'
const router = express.Router()

import {
    registerDoctor,doctorlogs,
    toggleActiveStatus,
    getdoctordetails,
    editdoctor,
    managetimeslot,
    verifyAndREsetPassword
//   editdoctor,
//   doctorlogs,
//   getdoctordetails,
//   gettalldoctors
} from '../controllers/doctorController'
import { protect } from '../middlewares/authMiddleware'

router.post('/createdoctor', protect, registerDoctor)
router.get("/toggle-active/:id", protect, toggleActiveStatus);

router.post('/editdoctor', protect, editdoctor)
router.get('/getdoctordetails/:id', protect, getdoctordetails)

router.get('/doctorlogs', doctorlogs)
router.post('/managetimeslot', managetimeslot)
router.post('/verifyAndREsetPassword', verifyAndREsetPassword)



// router.get('/gettalldoctors', gettalldoctors)

export default router
