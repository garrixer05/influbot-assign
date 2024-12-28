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
    callbackURL: "http://localhost:4000/google/auth/redirect",
    scope:"https://www.googleapis.com/auth/calendar.events",
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken)
    const {_json} = profile
    await findOrCreate(_json.name, _json.email, accessToken);
    const user = {
      ...profile._json,
      accessToken,
      refreshToken
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