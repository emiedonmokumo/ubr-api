import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { createPayment, getCustomer, getPaymentMethod, getStripeEvent } from '../controllers/stripe.js';
const router = express.Router()

// router.get('/', authenticate, (req, res)=>{
//     try {
//         res.json({user: typeof req.user.email})
//     } catch (error) {
//         res.status(500).json({ message: error.message || error.toString() });
//     }
// })

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


/**
 * @swagger
 * /api/stripe/customer/event:
 *   get:
 *     summary: Get Stripe events for a specific customer
 *     description: This endpoint retrieves a list of Stripe events for a specific customer based on their user ID.
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved Stripe events for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The event ID.
 *                   object:
 *                     type: string
 *                     description: The type of object (event).
 *                   created:
 *                     type: integer
 *                     description: Timestamp when the event was created.
 *                   data:
 *                     type: object
 *                     properties:
 *                       object:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The charge ID.
 *                           amount:
 *                             type: integer
 *                             description: The amount of the charge.
 *                           currency:
 *                             type: string
 *                             description: The currency of the charge.
 *                           customer:
 *                             type: string
 *                             description: The ID of the customer associated with the charge.
 *                           status:
 *                             type: string
 *                             description: The status of the charge (e.g., succeeded, failed).
 *                   livemode:
 *                     type: boolean
 *                     description: Indicates if the event occurred in live mode or test mode.
 *                   pending_webhooks:
 *                     type: integer
 *                     description: Number of pending webhooks for the event.
 *                   request:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The request ID.
 *                       idempotency_key:
 *                         type: string
 *                         description: The idempotency key for the request.
 *                   type:
 *                     type: string
 *                     description: The type of event (e.g., charge.succeeded).
 *       400:
 *         description: Customer not found for the provided user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error when retrieving events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 */
router.get('/customer/event', authenticate, getStripeEvent)


export default router;