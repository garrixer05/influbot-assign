import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import "./Google/Oauth.js"
import AuthRoutes from "./routes/AuthRoutes.js"
import AppRoutes from "./routes/AppRoutes.js"
import session from "express-session";
import passport from "passport";
import WebhookRoute from "./routes/WebhookRoute.js"


export const serUser = new Map();

dotenv.config();

const PORT = process.env.PORT;
const app = express();

//middlewares
app.use(cors(
    {
        origin:process.env.ORIGIN,
        // credentials:true
    }
));
app.use(session({
    secret:process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized:true,
    resave:true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(AuthRoutes)
app.use(AppRoutes)
app.use(WebhookRoute)


app.get("/", (req, res)=>{
    return res.status(200).send("Influbot API")
})
export default app;
// app.listen(PORT, ()=>{
//     console.log(`Server is running on ${PORT}`);
// })