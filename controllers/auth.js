import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import transporter from '../config/nodemailer.js';
import { OAuth2Client } from 'google-auth-library';
dotenv.config()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const resetPassword = async (req, res) => {
    try {
        const { email, password, otpCode } = req.body;

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatched = user.otpCode == otpCode
        if (!isMatched) return res.status(400).json({ message: 'Invalid Verification Code' });

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword;
        user.otpCode = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful!' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}

export const createAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        const verificationCode = Math.floor(10000 + Math.random() * 90000);

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already Exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            bio: {
                name: '',
                about: '',
                language: '',
                country: '',
                timeZone: '',
                dateFormat: '',
                timeFormat: '',
            },
            email,
            password: hashedPassword,
            otpCode: verificationCode
        })
        await newUser.save()


        // Email options for verification code
        const mailOptions = {
            from: process.env.ADMIN_MAIL, // Sender address
            to: newUser.email, // Recipient email
            subject: "Your Verification Code", // Subject line
            text: `Your verification code is: ${verificationCode}`, // Plain text body
        };

        // Send the verification email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Account created and code sent!' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
};


export const customLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if (user.authType !== 'Custom') {
            return res.status(404).json({ message: 'User must login with Google' });
        } else if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) return res.status(400).json({ message: 'Password Incorrect' });

        // If authentication is successful, generate and send the token
        const token = jwt.sign(
            { id: user._id }, // Payload (user info)
            process.env.JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Expiration time (optional)
        );
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.toString() })
    }
};


export const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  // Replace with your client ID
        });
        const payload = ticket.getPayload();

        const user = await User.findOne({ email: payload.email })
        if (!user) {
            const newUser = new User({
                bio: {
                    name: payload.name,
                    about: '',
                    language: '',
                    country: '',
                    timeZone: '',
                    dateFormat: '',
                    timeFormat: '',
                },
                email: payload.email,
                image: {
                    url: payload.picture
                },
                authType: 'Google',
                verified: true
            })

            await newUser.save()

            const token = jwt.sign(
                { id: newUser._id }, // Payload (user info)
                process.env.JWT_SECRET, // Secret key
                { expiresIn: '1h' } // Expiration time (optional)
            );
            return res.status(200).json({ newUser, token });

        } else {
            const token = jwt.sign(
                { id: user._id }, // Payload (user info)
                process.env.JWT_SECRET, // Secret key
                { expiresIn: '1h' } // Expiration time (optional)
            );
            return res.status(200).json({ user, token });
        };
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
};


// Send Verification Code
export const sendOtpCode = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User not found' });

        const verificationCode = Math.floor(10000 + Math.random() * 90000);
        // Assign the verification code and save the user
        user.otpCode = verificationCode;
        await user.save();

        // Email options for verification code
        const mailOptions = {
            from: process.env.ADMIN_MAIL, // Sender address
            to: user.email, // Recipient email
            subject: "Your Verification Code", // Subject line
            text: `Your verification code is: ${verificationCode}`, // Plain text body
        };

        // Send the verification email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification code sent!' });
    } catch (error) {
        res.status(500).json({ message: error })
    }
};

// Verify code
export const verifyCode = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatched = user.otpCode == otpCode
        if (!isMatched) return res.status(400).json({ message: 'Invalid Verification Code' });

        user.isVerified = true;
        user.otpCode = undefined;
        await user.save();

        // If authentication is successful, generate and send the token
        const token = jwt.sign(
            { id: user._id }, // Payload (user info)
            process.env.JWT_SECRET, // Secret key
            // { expiresIn: '1h' } // Expiration time (optional)
        );
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error })
    }
};