import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { createPayment, getCustomer, getPaymentMethod } from '../controllers/stripe.js';
const router = express.Router()

router.get('/', authenticate, (req, res)=>{
    try {
        res.json({user: typeof req.user.email})
    } catch (error) {
        res.status(500).json({ message: error.message || error.toString() });
    }
})

/**
 * @swagger
 * /api/stripe/create-payment:
 *   post:
 *     summary: Create a payment
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500000
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_1QdA6jLpEpLdG8D6ph8mYEfO"
 *               savePaymentMethod:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "id": "pi_3QdA6nLpEpLdG8D61aZGcDke",
 *                 "object": "payment_intent",
 *                 "amount": 500000,
 *                 "currency": "usd",
 *                 "status": "succeeded"
 *               }
 *       500:
 *         description: Server error
 */
router.post('/create-payment', authenticate, createPayment)


/**
 * @swagger
 * /api/stripe/payment-methods:
 *   get:
 *     summary: Get customer payment methods
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "object": "list",
 *                 "data": [
 *                   {
 *                     "id": "pm_1QdA6jLpEpLdG8D6ph8mYEfO",
 *                     "type": "card",
 *                     "card": {
 *                       "brand": "visa",
 *                       "last4": "4242",
 *                       "exp_month": 12,
 *                       "exp_year": 2026
 *                     }
 *                   }
 *                 ]
 *               }
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get('/payment-methods', authenticate, getPaymentMethod)


/**
 * @swagger
 * /api/stripe/customer:
 *   get:
 *     summary: Get customer details
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "id": "cus_RVpPMheHTkN8Iu",
 *                 "email": "example@example.com",
 *                 "metadata": {
 *                   "userId": "675ffc2fd36101dcceb23530"
 *                 }
 *               }
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get('/customer', authenticate, getCustomer)


export default router;