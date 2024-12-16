import googleTrends from 'google-trends-api'

export const getTrends = async (req, res) => {
    try {
        const result = await googleTrends.dailyTrends({
            geo: "US", // Specify the country (e.g., 'US' for United States, 'NG' for Nigeria)
        });
        res.json(JSON.parse(result));
    } catch (error) {
        res.status(500).json({ error: error.message || 'An unexpected error occurred while fetching trends.' });
    }
}