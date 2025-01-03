// "https://www.googleapis.com/auth/userinfo.profile"
// "https://www.googleapis.com/auth/calendar.events"

import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import dotenv from "dotenv";
import { findOrCreate } from '../contollers/AppController.js';
dotenv.config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST_REDIRECT,
    scope:"https://www.googleapis.com/auth/calendar.events",
  },
  async function(accessToken, refreshToken, profile, cb) {
    const {_json} = profile
    console.log(accessToken)
    // await findOrCreate(_json.name, _json.email, accessToken);
    const user = {
      ...profile._json,
      accessToken,
      expires_in:new Date().getTime()
      // refreshToken
    }
    return cb(null, user);
  }
));

passport.serializeUser((user, done)=>{
  done(null,user);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
})