import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(200).json({ message: error.toString() });
        console.log(error)
    }

}

export const updateBio = async (req, res) => {
    try {
        const { about, trending, categories } = req.body;

        // Find the user
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Build the update object dynamically
        const bioUpdate = {};
        if (about) bioUpdate.about = about;
        if (trending) bioUpdate.interest = { ...bioUpdate.interest, trending };
        if (categories) bioUpdate.interest = { ...bioUpdate.interest, categories };

        console.log(bioUpdate)

        // If no valid bio fields are provided, return an error
        if (Object.keys(bioUpdate).length == 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { bio: { ...user.bio, ...bioUpdate } } },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: 'Bio updated successfully', user: updatedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error });
    }
};
