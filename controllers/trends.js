import googleTrends from 'google-trends-api'
import { reddit } from '../config/reddit.js';
import NewsAPI from 'newsapi';
import axios from 'axios';
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);


export const getContents = async (req, res) => {
    try {
        const response = await newsapi.v2.everything({
            sources: 'techcrunch,bbc,cnbc,forbes,nytimes,reuters,guardian,buzzfeed,mashable,techradar,engadget,techcrunch,techradar,wired,ars-technica,bbc-news,bleacher-report,bloomberg,business-insider,cnn,espn,financial-times,fortune,google-news,ign,national-geographic,nbc-news,new-scientist,newsweek,techcrunch,the-verge,usa-today,vice-news,wired',
            pageSize: 20, // Number of articles per page
            sortBy: 'publishedAt', // Sort by most recent
        });

        res.status(200).json(response.articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch trends.' });
    }
}

export const searchContent = async (req, res) => {
    const { q, domain } = req.body;
    try {
        const response = await newsapi.v2.everything({
            q: q,
            domains: domain,
            pageSize: 200, // Number of articles per page
        });

        res.status(200).json(response.articles[1]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch trends.' });
    }
}

export const getTrends = async (req, res) => {
    try {
        const response = await fetch('https://explodingtopics.com/api/trends');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return res.status(200).json(data); // Return the fetched data as a JSON response
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || 'An unexpected error occurred while fetching trends.' }) // Return an error response if something goes wrong
    }
}

// Get a trend
export const getTrend = async (req, res) => {
    try {
        const response = await fetch(`https://explodingtopics.com/api/trend/${req.params.path}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return res.status(200).json(data); // Return the fetched data as a JSON response
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message || 'An unexpected error occurred while fetching trends.' }) // Return an error response if something goes wrong
    }
}

export const dailyTrends = async (req, res) => {
    try {
        // Fetch popular subreddits (fetching 5 popular subreddits as an example)
        // const subredditTrends = await reddit.get('/r/popular', { limit: 20 });
        const subredditTrends = await reddit.get('/r/trendingsubreddits', { limit: 20 });

        // Fetch Google Trends data
        const result = await googleTrends.dailyTrends({
            geo: 'US', // Specify the country code for the trends

        });

        const googleTrendsData = JSON.parse(result);
        const googleDailySearch = googleTrendsData.default.trendingSearchesDays[0].trendingSearches;
        // const googleTrendDate = googleTrendsData.default.trendingSearchesDays[0].date;

        // // Uniformly combine both data sources
        const combinedTrends = [
            // Combine Google Trends
            ...googleDailySearch.map(search => ({
                name: search.title.query,
                trafficVolume: search.formattedTraffic || 0,
                type: 'google',  // Add a type to distinguish Google trends
                // description: search. || 'No description available', // Add a link or placeholder
                // trendDate: googleTrendDate,
                url: search.url,
                snippet: search.snippet,
                url: search.image.newsUrl,
                image: search.image.imageUrl
            })),

            // Combine Reddit Trends
            // ...subredditTrends.data.children.map(post => ({
            //     name: post.data.title,
            //     trafficVolume: post.data.subscribers,
            //     type: 'reddit',  // Add a type to distinguish Reddit trends
            //     description: post.data.title,
            //     trendDate: post.data.created_utc,
            //     url: post.data.url,
            //     snippet: post.data.selftext
            // }))
        ];

        // Send the uniform combined response
        // res.status(200).json(googleDailySearch);
        res.status(200).json(combinedTrends);
    } catch (error) {
        // Handle any errors that occur during the fetch or processing
        console.error('Error fetching trends:', error);
        res.status(500).json({
            error: error.message || 'An unexpected error occurred while fetching trends.',
        });
    }
};


export const searchTrends = async (req, res) => {
    const { q } = req.body;
    if (!q) {
        return res.status(400).json({ error: "A search query ('q') is required." });
    }

    try {
        // Fetch popular subreddits based on the query
        // const subredditTrends = await reddit.get(`/r/${q}`, { limit: 20 });
        const result = await googleTrends.interestOverTime({ keyword: q });

        const googleTrendsData = JSON.parse(result);
        // console.log(googleTrendsData)

        // Send the uniform combined response
        res.status(200).json(googleTrendsData);
    } catch (error) {
        // Handle any errors that occur during the fetch or processing
        console.error('Error fetching trends:', error);
        res.status(500).json({
            error: error.message || 'An unexpected error occurred while fetching trends.',
        });
    }
};
