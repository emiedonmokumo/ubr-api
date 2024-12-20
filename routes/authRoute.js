import express from 'express';
import {
    customLogin,
    googleAuth,
    sendOtpCode,
    verifyCode,
    createAccount,
    resetPassword
} from '../controllers/auth.js';
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup/custom:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user with an email and password. Sends a verification code to the user's email and returns a JSON Web Token (JWT) for authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Account created successfully. A verification code was sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created and code sent!
 *       400:
 *         description: Bad request. The user already exists or the request data is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred
 */
router.post('/signup/custom', createAccount)

/**
 * @swagger
 * /api/auth/login/custom:
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
 * /api/auth/otp:
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

// /**
//  * @swagger
//  * /api/auth/otp/verify:
//  *   put:
//  *     summary: Verify the OTP code sent to the user's email.
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: user@example.com
//  *               otpCode:
//  *                 type: integer
//  *                 example: 12345
//  *     responses:
//  *       200:
//  *         description: OTP verified successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 user:
//  *                   type: object
//  *                   description: User information.
//  *                 token:
//  *                   type: string
//  *                   description: JWT token.
//  *       400:
//  *         description: Invalid verification code.
//  *       404:
//  *         description: User not found.
//  *       500:
//  *         description: Internal server error.
//  */
// router.put('/otp/verify', verifyCode);

/**
 * @swagger
 * /api/auth/google:
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
 *               token:
 *                 type: string
 *                 description: Google ID token from the frontend.
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...
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
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication failed."
 */
router.post('/google', googleAuth);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password after verifying the OTP code.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The new password to be set for the user.
 *                 example: newpassword123
 *               otpCode:
 *                 type: number
 *                 description: The OTP code sent to the user's email.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Invalid OTP code.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/reset-password', resetPassword)

export default router;
