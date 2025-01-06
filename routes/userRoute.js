import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { deleteUser, getUser, updateBio } from '../controllers/user.js';
const router = express.Router()

/**
 * @swagger
* /api/user:
*   delete:
*     summary: Delete user account
*     security:
*       - bearerAuth: []
*     tags:
*       - User
*     responses:
*       200:
*         description: User successfully deleted
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: User Deleted!
*       404:
*         description: User not found
*       500:
*         description: Internal server error
*/
router.delete('/', authenticate, deleteUser)

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
 *                 bio:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     about:
 *                       type: string
 *                     interest:
 *                       type: object
 *                       properties:
 *                         trending:
 *                           type: array
 *                           items:
 *                             type: string
 *                         categories:
 *                           type: array
 *                           items:
 *                             type: string
 *                     language:
 *                       type: string
 *                     country:
 *                       type: string
 *                     timeZone:
 *                       type: string
 *                     dateFormat:
 *                       type: string
 *                     timeFormat:
 *                       type: string
 *                 image:
 *                   type: string
 *                 isVerified:
 *                   type: boolean
 *                 authType:
 *                   type: string
 *                 role:
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
 *               name:
 *                 type: string
 *               about:
 *                 type: string
 *               trending:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               language:
 *                 type: string
 *               country:
 *                 type: string
 *               timeZone:
 *                 type: string
 *               dateFormat:
 *                 type: string
 *               timeFormat:
 *                 type: string
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
 *                         name:
 *                           type: string
 *                         about:
 *                           type: string
 *                         interest:
 *                           type: object
 *                           properties:
 *                             trending:
 *                               type: array
 *                               items:
 *                                  type: string
 *                             categories:
 *                               type: array
 *                               items:
 *                                 type: string
 *                         language:
 *                           type: string
 *                         country:
 *                           type: string
 *                         timeZone:
 *                           type: string
 *                         dateFormat:
 *                           type: string
 *                         timeFormat:
 *                           type: string
 *       400:
 *         description: No valid fields to update
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/bio', authenticate, updateBio)

export default router