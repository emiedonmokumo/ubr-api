import express from 'express';
import {
    customLogin,
    googleAuth,
    sendOtpCode,
    verifyCode,
} from '../controllers/auth.js';
const router = express.Router();

/**
 * @swagger
 * /api/login/custom:
 *   post:
 *     summary: Custom login using email and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User information.
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *       400:
 *         description: Incorrect password.
 *       404:
 *         description: User not found or invalid login method.
 */
router.post('/login/custom', customLogin);

/**
 * @swagger
 * /api/otp:
 *   put:
 *     summary: Send a verification OTP to the user's email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code sent.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/otp', sendOtpCode);

/**
 * @swagger
 * /api/otp/verify:
 *   put:
 *     summary: Verify the OTP code sent to the user's email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otpCode:
 *                 type: integer
 *                 example: 12345
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User information.
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *       400:
 *         description: Invalid verification code.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/otp/verify', verifyCode);

/**
 * @swagger
 * /api/google:
 *   post:
 *     summary: Authenticate user with Google account.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               picture:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User information.
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *       500:
 *         description: Internal server error.
 */
router.post('/google', googleAuth);

export default router;
