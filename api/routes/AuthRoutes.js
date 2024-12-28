import { Router } from "express";
import passport from "passport";
import { logoutUser } from "../contollers/AuthController.js";

const router = Router();

router.get("/google/auth/login", passport.authenticate("google", {scope:["email", "profile", "https://www.googleapis.com/auth/calendar.events"]}))
router.get("/google/auth/redirect", passport.authenticate("google", {
    successRedirect:"/app/getUser",
    failureRedirect:"/failure"
}))
router.get("/logout", logoutUser)

export default router;