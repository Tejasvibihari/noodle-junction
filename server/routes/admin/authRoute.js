import express from 'express'
import { adminSignup, adminLogin } from '../../controllers/admin/authController.js'
const router = express.Router()

router.post('/sign-up', adminSignup)
router.post('/sign-in', adminLogin)

export default router;