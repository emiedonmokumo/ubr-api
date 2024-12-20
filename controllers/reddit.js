import { reddit } from '../config/reddit.js';

export const redditTrend = async (req, res) => {
    try {
        // const subreddits = await reddit.getPopularSubreddits({ limit: 10 });
        const response = await reddit.get('/r/popular', { limit: 20 });
        
        // console.log(response)
        // const trendingSubreddits = response.data.children.map(post => post.data.subreddit_name_prefixed);

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

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch Reddit trends.' });
    }
}


export const getSingleSubreddit = async (req, res) => {
    const { subredditName } = req.params; // Assuming you are passing the subreddit ID in the URL as a parameter
    try {
        // Fetch subreddit details by ID

        const subreddit = await reddit.get(`/r/${subredditName}`, { limit: 10 });

        // console.log(subreddit)

        res.json(subreddit);
    } catch (error) {
        console.error('Error fetching Reddit trend:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch Reddit trend.' });
    }
};
