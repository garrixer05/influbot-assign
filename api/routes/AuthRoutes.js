import { Router } from "express";
import passport from "passport";
import { logoutUser, success } from "../contollers/AuthController.js";
import { failureRedirect } from "../contollers/AppController.js";

const router = Router();

router.get("/google/auth/login", passport.authenticate("google",{scope:["email", "profile", "https://www.googleapis.com/auth/calendar.events"]}))
router.get("/google/auth/redirect", passport.authenticate("google", {
    // successReturnToOrRedirect:"/app/getUser",
    failureRedirect:"/failure"
}, function(req, res) {
    res.redirect('/app/getUser');
  }))
router.get("/auth/success", success);
router.get("/failure", failureRedirect )
router.get("/logout", logoutUser)

export default router;