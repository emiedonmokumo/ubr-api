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
        const { name, about, trending, categories, language, country, timeZone, dateFormat, timeFormat } = req.body;

        // Find the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prepare the update object
        const bioUpdate = {};

        if (about) bioUpdate['bio.about'] = about;
        if (name) bioUpdate['bio.name'] = name;
        if (trending) bioUpdate['bio.interest.trending'] = trending;
        if (categories) bioUpdate['bio.interest.categories'] = categories;
        if (language) bioUpdate['bio.language'] = language;
        if (country) bioUpdate['bio.country'] = country;
        if (timeZone) bioUpdate['bio.timeZone'] = timeZone;
        if (dateFormat) bioUpdate['bio.dateFormat'] = dateFormat;
        if (timeFormat) bioUpdate['bio.timeFormat'] = timeFormat;

        // If no valid fields to update
        if (Object.keys(bioUpdate).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: bioUpdate },
            { new: true, runValidators: true } // Return the updated document with validation
        );

        res.status(200).json({
            message: 'Bio updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ message: 'An error occurred while updating the bio', error: error.message });
    }
};

