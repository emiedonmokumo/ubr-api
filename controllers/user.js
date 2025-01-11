import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

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

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.deleteOne({ _id: req.user.id })

        res.status(200).json({ message: 'User Deleted!' });
    } catch (error) {
        res.status(200).json({ message: error.toString() });
        console.log(error)
    }

}

// Update Bio
export const updateBio = async (req, res) => {
    try {
        const {
            name, about, trending, categories, language, country, timeZone, dateFormat, timeFormat, image, // Image field in the request body
        } = req.body;

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

        console.log(bioUpdate)

        let imageUpdate;

        // Handle image upload if the image field exists
        if (image) {
            const result = await cloudinary.v2.uploader.upload(image, {
                folder: 'UBR', // Folder name
                resource_type: 'image',
            });

            console.log(result)

            imageUpdate = {
                url: result.secure_url,   // Save the image URL
                public_id: result.public_id, // Save the public ID
            }; 
            console.log(imageUri)
        }

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    ...bioUpdate,
                    image: imageUpdate
                }
            },
            { new: true, runValidators: true } // Return the updated document with validation
        );

        res.status(200).json({
            message: 'Bio updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating bio:', error);
        res
            .status(500)
            .json({ message: 'An error occurred while updating the bio', error: error.message });
    }
};


// // Function to delete an image
// export const deleteImage = async (req, res) => {
//     try {
//       const { public_id } = req.body; // Get the public_id from the request body
  
//       if (!public_id) {
//         return res.status(400).json({ message: 'Public ID is required.' });
//       }
  
//       // Perform the deletion
//       const result = await cloudinary.v2.uploader.destroy(public_id);
  
//       if (result.result === 'ok') {
//         res.status(200).json({ message: 'Image deleted successfully.', result });
//       } else {
//         res.status(400).json({ message: 'Failed to delete the image.', result });
//       }
//     } catch (error) {
//       console.error('Error deleting image:', error);
//       res.status(500).json({ message: 'An error occurred while deleting the image.', error });
//     }
//   };

