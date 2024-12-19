import googleTrends from 'google-trends-api'
import { reddit } from '../config/reddit.js';

export const getTrends = async (req, res) => {
    try {
        // Fetch popular subreddits (fetching 5 popular subreddits as an example)
        const subredditTrends = await reddit.get('/r/popular', { limit: 20 });

        // Fetch Google Trends data
        const result = await googleTrends.dailyTrends({
            geo: 'US', // Specify the country code for the trends
        });

        const googleTrendsData = JSON.parse(result);
        const googleDailySearch = googleTrendsData.default.trendingSearchesDays[0].trendingSearches;
        const googleTrendDate = googleTrendsData.default.trendingSearchesDays[0].date;

        // Uniformly combine both data sources
        const combinedTrends = [
            // Combine Google Trends
            ...googleDailySearch.map(search => ({
                name: search.title.query,
                trafficVolume: search.trafficVolume,
                type: 'google',  // Add a type to distinguish Google trends
                description: search.exploreLink || 'No description available', // Add a link or placeholder
                trendDate: googleTrendDate
            })),

            // Combine Reddit Trends
            ...subredditTrends.data.children.map(post => ({
                name: post.data.subreddit_name_prefixed,
                trafficVolume: post.data.subscribers,
                type: 'reddit',  // Add a type to distinguish Reddit trends
                description: post.data.title,
                trendDate: post.data.created_utc
            }))
        ];

        // Send the uniform combined response
        res.json(combinedTrends);
    } catch (error) {
        // Handle any errors that occur during the fetch or processing
        console.error('Error fetching trends:', error);
        res.status(500).json({
            error: error.message || 'An unexpected error occurred while fetching trends.',
        });
    }
};


export const searchTrends = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "A search query ('q') is required." });
    }

    try {
        // Fetch popular subreddits based on the query
        const subredditTrends = await reddit.getSubreddit(q).fetch();

        // Send the uniform combined response
        res.json(subredditTrends);
    } catch (error) {
        // Handle any errors that occur during the fetch or processing
        console.error('Error fetching trends:', error);
        res.status(500).json({
            error: error.message || 'An unexpected error occurred while fetching trends.',
        });
    }
};
