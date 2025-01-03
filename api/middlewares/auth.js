import axios from "axios";
import passport from "passport";
export const isLoggedin = async (req, res, next)=>{
    if(new Date().getTime() - req.session.passport.user.expires_in > 3600*1000){
        res.sendStatus(401);
    }
    req.user ? next() : res.sendStatus(401);
}
export const psp = passport.authenticate("google", ["email", "profile", "https://www.googleapis.com/auth/calendar.events"]);

export const verifyToken = async (req, res, next)=>{
    if(!req.query.token){
        return res.sendStatus(401)
    }
    try {
        const {data} = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${req.query.token}`, {
            headers :{
              Authorization: `Bearer ${req.querytoken}`,
              Accept:'application/json'
            }
        });
    } catch (error) {
        return res.sendStatus(401);
    }
    next()
}