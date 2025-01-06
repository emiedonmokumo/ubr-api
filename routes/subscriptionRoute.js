import express from 'express'
const router = express.Router()
import { createSubscription, getSubscriptions, updateSubscription } from "../controllers/subscription.js";
import authenticate from "../middleware/authMiddleware.js";


/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Create a new subscription
 *     description: Create a new subscription plan with required fields like name, features, price, etc.
 *     operationId: createSubscription
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *     requestBody:
 *       description: Subscription data to create a new subscription.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - features
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subscription plan.
 *                 example: "Premium Plan"
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of features included in the subscription.
 *                 example: ["Feature 1", "Feature 2"]
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the subscription plan.
 *                 example: 19.99
 *               currency:
 *                 type: string
 *                 description: Currency of the price (optional).
 *                 nullable: true
 *                 example: "USD"
 *               billingCycle:
 *                 type: string
 *                 description: Billing cycle of the subscription (optional).
 *                 nullable: true
 *                 example: "monthly"
 *               recommended:
 *                 type: boolean
 *                 description: Indicates if this subscription plan is recommended (optional).
 *                 nullable: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Subscription created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription created successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Premium Plan"
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Feature 1", "Feature 2"]
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 19.99
 *       400:
 *         description: Bad request (missing required fields).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name, features, and price are required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating subscription"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.post('/', authenticate, createSubscription)

/**
 * @swagger
 * /api/subscription:
 *   get:
 *     summary: Get all subscriptions
 *     description: Fetch a list of all subscription plans.
 *     operationId: getSubscriptions
 *     tags:
 *       - Subscriptions
 *     responses:
 *       200:
 *         description: A list of subscriptions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Premium Plan"
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Feature 1", "Feature 2"]
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 19.99
 *                   currency:
 *                     type: string
 *                     example: "USD"
 *                   billingCycle:
 *                     type: string
 *                     example: "monthly"
 *                   recommended:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching subscriptions"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.get('/', getSubscriptions)

/**
 * @swagger
 * /api/subscription/{id}:
 *   put:
 *     summary: Update an existing subscription
 *     description: Update details of an existing subscription plan.
 *     operationId: updateSubscription
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the subscription to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Subscription data to update the subscription.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subscription plan.
 *                 example: "Premium Plan"
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of features included in the subscription.
 *                 example: ["Feature 1", "Feature 2"]
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the subscription plan.
 *                 example: 19.99
 *               currency:
 *                 type: string
 *                 description: Currency of the price (optional).
 *                 nullable: true
 *                 example: "USD"
 *               billingCycle:
 *                 type: string
 *                 description: Billing cycle of the subscription (optional).
 *                 nullable: true
 *                 example: "monthly"
 *               recommended:
 *                 type: boolean
 *                 description: Indicates if this subscription plan is recommended (optional).
 *                 nullable: true
 *                 example: true
 *     responses:
 *       200:
 *         description: Subscription updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription updated successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Premium Plan"
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Feature 1", "Feature 2"]
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 19.99
 *       404:
 *         description: Subscription not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating subscription"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
router.put('/:id', authenticate, updateSubscription)

export default router
