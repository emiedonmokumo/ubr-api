import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv'
dotenv.config()

const secretKey = process.env.JWT_SECRET; // This should be stored securely, e.g., in an environment variable

passport.use(new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
  },
  (payload, done) => {
    try {
      // You can add user validation logic here, e.g., check if the user exists in the database
      return done(null, payload); // Attach the payload (user information) to the request
    } catch (error) {
      return done(error, false);
    }
  }
));

const authenticate = passport.authenticate('jwt', { session: false });

export default authenticate;