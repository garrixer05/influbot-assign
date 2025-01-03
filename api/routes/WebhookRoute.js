import { Router } from "express";
import { gotNotified } from "../contollers/WebhookController.js";

const router = Router();


router.post("/webhook", gotNotified);

export default router;