import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

const secretKey = process.env.JWT_SECRET; // This should be stored securely, e.g., in an environment variable

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    async (payload, done) => {
      try {

        // Find the user in the database using the payload's user ID
        const user = await User.findById(payload.id);

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Attach the user to the request
        return done(null, { id: user._id });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Middleware to authenticate the JWT and attach the user to the request
const authenticate = passport.authenticate('jwt', { session: false });

export default authenticate;
