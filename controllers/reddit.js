import Snoowrap from "snoowrap";
import dotenv from 'dotenv'
dotenv.config()

export const reddit = new Snoowrap({
    userAgent: 'UBR', // Customize with your app name and version
    clientId: process.env.REDDIT_ID, // Your Client ID
    clientSecret: process.env.REDDIT_SECRET, // Your Client Secret
    accessToken: process.env.REDDIT_ACCESS_TOKEN,
});


export const redditTrend = async (req, res) => {
    try {
        const subreddits = await reddit.getPopularSubreddits({ limit: 10 });
        // // Extract necessary data
        // const trends = subreddits.map((subreddit) => ({

        //     name: subreddit.display_name,
        //     title: subreddit.title,
        //     subscribers: subreddit.subscribers,
        //     description: {
        //         description: subreddit.description,
        //         html: subreddit.description_html
        //     },
        //     date: new Date(subreddit.created * 1000).getDate()
        // }));

        res.json(subreddits);
    } catch (error) {
        console.error('Error fetching Reddit trends:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch Reddit trends.' });
    }
}


export const getSingleSubreddit = async (req, res) => {
    const { subredditName } = req.params; // Assuming you are passing the subreddit ID in the URL as a parameter
    try {
        // Fetch subreddit details by ID
        const subreddit = await reddit.getSubreddit(subredditName).fetch();

        res.json(subreddit);
    } catch (error) {
        console.error('Error fetching Reddit trend:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch Reddit trend.' });
    }
};
