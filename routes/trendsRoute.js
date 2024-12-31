import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { dailyTrends, getContents, getTrends, searchContent, searchTrends } from '../controllers/trends.js';
import { getSingleSubreddit, redditTrend } from '../controllers/reddit.js';
const router = express.Router()

router.get('/', getTrends)

/**
 * @swagger
 * /api/trends/daily:
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
 *                     type: string
 *                     example: '20k+'
 *                   type:
 *                     type: string
 *                     example: "google" # Indicates the source, either 'google' or 'reddit'
 *                   url:
 *                      type: string
 *                      example: "https://example.com"
 *                   image:
 *                      type: string
 *                      example: "https://example.com/image.jpg"
 *                   
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
router.get('/daily', dailyTrends)

/**
 * @swagger
 * /api/trends/search:
 *   post:
 *     summary: Fetch subreddit trends
 *     description: Retrieve popular subreddits related to a specific search query.
 *     tags:
 *       - Trends
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               q:
 *                 type: string
 *                 description: The search query to find trends.
 *                 example: "technology"
 *     responses:
 *       200:
 *         description: Successfully retrieved trends.
 *       400:
 *         description: Bad request. Query parameter 'q' is required in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "A search query ('q') is required in the request body."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "An unexpected error occurred while fetching trends."
 */
router.post('/search', authenticate, searchTrends)


/**
 * @swagger
 * /api/trends/contents:
 *   get:
 *     summary: Get the latest news articles
 *     tags:
 *          - Trends
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *     description: Fetch the latest news articles from multiple sources, sorted by publication date.
 *     responses:
 *       200:
 *         description: A list of news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   source:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   author:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   url:
 *                     type: string
 *                   publishedAt:
 *                     type: string
 *                   content:
 *                     type: string
 *       500:
 *         description: Failed to fetch trends
 */
router.get('/contents', authenticate, getContents)


// Debugging
// router.get('/reddit', redditTrend)
// router.get('/reddit/:subredditName', getSingleSubreddit)

export default router;