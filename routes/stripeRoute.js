import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { createPayment, getPaymentMethod } from '../controllers/stripe.js';
const router = express.Router()

// router.get('/', authenticate, (req, res)=>{
//     try {
//         res.json({user: req.user.id})
//     } catch (error) {
//         res.status(500).json({ message: error.message || error.toString() });
//     }
// })

router.post('/create-payment', authenticate, createPayment)

router.get('/payment-methods', authenticate, getPaymentMethod)

export default router;