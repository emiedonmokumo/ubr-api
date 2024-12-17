import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { getTrends, searchTrends } from '../controllers/trends.js';
import { getSingleSubreddit, redditTrend } from '../controllers/reddit.js';
const router = express.Router()

/**
 * @swagger
 * /api/trends:
 *   get:
 *     summary: Fetch daily trends
 *     description: Retrieves daily trending topics from Google Trends and popular subreddits.
 *     tags:
 *       - Trends
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *         description: The number of popular subreddits to fetch. Defaults to 5.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily trends.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Taylor Swift 2024 Tour"
 *                   trafficVolume:
 *                     type: integer
 *                     example: 2000000
 *                   type:
 *                     type: string
 *                     example: "google" # Indicates the source, either 'google' or 'reddit'
 *                   description:
 *                     type: string
 *                     example: "Explore Taylor Swift's tour popularity and trends."
 *                   trendDate:
 *                     type: integer
 *                     format: date-time
 *                     example: 1558894980
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication required"
 *       500:
 *         description: Internal server error while fetching trends.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred while fetching trends."
 */
router.get('/', authenticate, getTrends)

/**
 * @swagger
 * /api/trends/search:
 *   get:
 *     summary: Fetch subreddit trends
 *     description: Retrieve popular subreddits related to a specific search query.
 *     tags:
 *       - Trends
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: The search query to find subreddit trends.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved trends.
 *       400:
 *         description: Bad request. Query parameter 'q' is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "A search query ('q') is required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "An unexpected error occurred while fetching trends."
 */
router.get('/search', authenticate, searchTrends)


// Debugging
router.get('/reddit', authenticate, redditTrend)
router.get('/reddit/:subredditName', authenticate, getSingleSubreddit)

export default router;