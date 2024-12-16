import express from 'express'
import authenticate from '../middleware/authMiddleware.js';
import { getTrends } from '../controllers/trends.js';
const router = express.Router()

/**
 * @swagger
 * /api/trends:
 *   get:
 *     summary: Fetch daily Google Trends
 *     description: Retrieves the daily trending topics from Google Trends for a specified country.
 *     tags:
 *       - Trends
 *     security:
 *       - bearerAuth: [] # Indicates the route requires authentication using a Bearer Token
 *     parameters:
 *       - in: query
 *         name: geo
 *         schema:
 *           type: string
 *           example: US
 *         required: false
 *         description: The geographic location for which to fetch trends (e.g., 'US' for the United States, 'NG' for Nigeria). Defaults to 'US'.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily trends.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trendingSearchesDays:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-15"
 *                       trendingSearches:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title:
 *                               type: string
 *                               example: "Taylor Swift 2024 Tour"
 *                             articles:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   title:
 *                                     type: string
 *                                     example: "Taylor Swift announces new tour dates"
 *                                   url:
 *                                     type: string
 *                                     example: "https://www.example.com/taylor-swift-tour"
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
 *         description: Internal server error while fetching Google Trends.
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

export default router;