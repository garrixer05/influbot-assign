import passport from "passport";
import jwt from 'jsonwebtoken'
import { verifyAccessToken } from "../Google/Calender.js";
export const isLoggedin = async (req, res, next)=>{
    if(new Date().getTime() - req.session.passport.user.expires_in > 3600*1000){
        res.sendStatus(401);
    }
    req.user ? next() : res.sendStatus(401);
}
export const psp = passport.authenticate("google", ["email", "profile", "https://www.googleapis.com/auth/calendar.events"]);

export const verifyToken = async (req, res)=>{
    await verifyAccessToken(req.query.token);
    return res.send({t})
}