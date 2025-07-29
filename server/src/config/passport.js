import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Check if a user with the same email exists (registered via OTP or other method)
      const email = profile.emails?.[0].value;
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        // If user exists but doesn't have googleId, update it
        if (!existingUser.googleId) {
          existingUser.googleId = profile.id;
          await existingUser.save();
          user = existingUser;
        } else {
          // If googleId exists, use that user
          user = existingUser;
        }
      } else {
        // No user with this email, create new
        user = new User({
          name: profile.displayName,
          email,
          googleId: profile.id
        });
        try {
          await user.save();
        } catch (err) {
          // Handle duplicate key error
          if (err.code === 11000) {
            // Try to find the user again (race condition)
            user = await User.findOne({ $or: [{ email }, { googleId: profile.id }] });
          } else {
            return done(err);
          }
        }
      }
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});