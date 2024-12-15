import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { getUser, updateBio } from '../controllers/user.js';
const router = express.Router()


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get user details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, getUser)

/**
* @swagger
/api/user/bio:
 *   put:
 *     summary: Update user bio
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               about:
 *                 type: string
 *               trending:
 *                 type: boolean
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     bio:
 *                       type: object
 *                       properties:
 *                         about:
 *                           type: string
 *                         interest:
 *                           type: object
 *                           properties:
 *                             trending:
 *                               type: boolean
 *                             categories:
 *                               type: array
 *                               items:
 *                                 type: string
 *       400:
 *         description: No valid fields to update
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/bio', authenticate, updateBio)

export default router