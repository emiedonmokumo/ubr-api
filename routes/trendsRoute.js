import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { dailyTrends, getContents, getTrends, searchContent, searchTrends } from '../controllers/trends.js';
import { getSingleSubreddit, redditTrend } from '../controllers/reddit.js';
const router = express.Router()

/**
 * @swagger
 * /api/trends:
 *   get:
 *     summary: Get the latest trends from Exploding Topics
 *     description: Fetches trending topics with detailed information, including growth, search history, and keyword data.
 *     tags:
 *       - Trends
 *     responses:
 *       200:
 *         description: A list of trends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique ID of the trend
 *                       createdAt:
 *                         type: integer
 *                         description: Timestamp of when the trend was created
 *                       keyword:
 *                         type: string
 *                         description: The keyword representing the trend
 *                       topic:
 *                         type: string
 *                         description: Type of the trend (e.g., keyword)
 *                       searchHistory:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: integer
 *                               description: The search volume at a specific time
 *                             time:
 *                               type: integer
 *                               description: Timestamp when the search value was recorded
 *                       regressions:
 *                         type: object
 *                         additionalProperties:
 *                           type: object
 *                           properties:
 *                             gradient:
 *                               type: number
 *                               description: Regression gradient
 *                             yIntercept:
 *                               type: number
 *                               description: Y intercept of the regression line
 *                             exponent:
 *                               type: number
 *                               nullable: true
 *                               description: Exponent in regression if applicable
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: Categories associated with the trend
 *                       classifications:
 *                         type: object
 *                         properties:
 *                           3:
 *                             type: string
 *                             description: Classification for the 3-month period
 *                           6:
 *                             type: string
 *                             description: Classification for the 6-month period
 *                           12:
 *                             type: string
 *                             description: Classification for the 12-month period
 *                           24:
 *                             type: string
 *                             description: Classification for the 24-month period
 *                           60:
 *                             type: string
 *                             description: Classification for the 60-month period
 *                           120:
 *                             type: string
 *                             description: Classification for the 120-month period
 *                           180:
 *                             type: string
 *                             description: Classification for the 180-month period
 *                           proj12:
 *                             type: string
 *                             description: Classification for projected 12 months
 *                       keywordDataGlobal:
 *                         type: object
 *                         properties:
 *                           vol:
 *                             type: integer
 *                             description: Global search volume
 *                           cpc:
 *                             type: number
 *                             description: Cost per click for the keyword
 *                       path:
 *                         type: string
 *                         description: URL-friendly path for the trend
 *                       premiumTimestamp:
 *                         type: integer
 *                         description: Timestamp indicating when the trend became premium
 *                       premium:
 *                         type: boolean
 *                         description: Whether the trend is premium
 *                       branded:
 *                         type: boolean
 *                         description: Whether the trend is branded
 *                       briefDescription:
 *                         type: string
 *                         description: A brief description of the trend
 *                       growth:
 *                         type: object
 *                         properties:
 *                           3:
 *                             type: number
 *                             description: Growth rate over 3 months
 *                           6:
 *                             type: number
 *                             description: Growth rate over 6 months
 *                           12:
 *                             type: number
 *                             description: Growth rate over 12 months
 *                           24:
 *                             type: number
 *                             description: Growth rate over 24 months
 *                           60:
 *                             type: number
 *                             description: Growth rate over 60 months
 *                           120:
 *                             type: number
 *                             description: Growth rate over 120 months
 *                           180:
 *                             type: number
 *                             description: Growth rate over 180 months
 *                           proj12:
 *                             type: number
 *                             description: Projected growth rate for the next 12 months
 *                       predictions:
 *                         type: object
 *                         properties:
 *                           last_10_years:
 *                             type: object
 *                             properties:
 *                               dataGranularity:
 *                                 type: string
 *                                 description: Granularity of the data (e.g., month)
 *                               predictions:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     time:
 *                                       type: integer
 *                                       description: Timestamp for the prediction
 *                                     value:
 *                                       type: number
 *                                       description: Predicted value for the given time
 *                           last_1_year:
 *                             type: object
 *                             properties:
 *                               dataGranularity:
 *                                 type: string
 *                                 description: Granularity of the data (e.g., week)
 *                               predictions:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     time:
 *                                       type: integer
 *                                       description: Timestamp for the prediction
 *                                     value:
 *                                       type: number
 *                                       description: Predicted value for the given time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
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