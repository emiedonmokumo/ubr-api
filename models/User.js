import mongoose, { Document, Model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: String,
    bio: {
        about: {
            type: String
        },
        interest: {
            trending: {
                type: [String]
            },
            categories: {
                type: [String]
            }
        }
    },
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        required: [true, 'Email is required'],
    },
    image: {
        type: String,
    },
    password: {
        type: String,
    },
    isVerified: { type: Boolean, default: false },
    otpCode: String,
    authType: { type: String, enum: ["Google", "Custom"] },
    role: { type: String, enum: ["User", "Admin"], default: 'User' }
}, { timestamps: true });

// Pre-save middleware
userSchema.pre('save', function (next) {
    // Only run this function if the authType is not explicitly set
    if (!this.isModified('authType')) {
        if (this.password) {
            this.authType = 'Custom';
        } else {
            this.authType = 'Google';
        }
    }
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;