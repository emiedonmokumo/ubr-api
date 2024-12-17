import googleTrends from 'google-trends-api'
import { reddit } from './reddit.js';

export const getTrends = async (req, res) => {
    try {
        // Fetch popular subreddits (fetching 5 popular subreddits as an example)
        const subredditTrends = await reddit.getPopularSubreddits({ limit: 50 });

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
            ...subredditTrends.map(subreddit => ({
                name: subreddit.display_name,
                trafficVolume: subreddit.subscribers,
                type: 'reddit',  // Add a type to distinguish Reddit subreddits
                description: subreddit.public_description || 'No description available',  // Add subreddit description or placeholder
                trendDate: subreddit.created_utc
            })),
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
