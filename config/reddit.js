import Reddit from "reddit";
import dotenv from 'dotenv'
dotenv.config()

export const reddit = new Reddit({
    userAgent: 'UBR', // Customize with your app name and version
    // clientId: process.env.REDDIT_ID, // Your Client ID
    appId: process.env.REDDIT_ID, // Your Client ID
    appSecret: process.env.REDDIT_SECRET, // Your Client Secret
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    // clientSecret: process.env.REDDIT_SECRET, // Your Client Secret
    // accessToken: process.env.REDDIT_ACCESS_TOKEN,
});