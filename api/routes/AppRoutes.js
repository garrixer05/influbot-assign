import { Router } from "express";
import { createEvent, deleteEvent, failureRedirect, getUser, updateEvent } from "../contollers/AppController.js";
import { isLoggedin, psp } from "../middlewares/auth.js";
import { createEventValidateSchemaChain, deleteEventValidateSchema, updateEventValidateSchema, validateResults } from "../utils/validator.js";

const router = Router();

router.get("/app/getUser", psp, isLoggedin, getUser);
router.get("/failure", failureRedirect);
router.post("/app/create-event", isLoggedin,createEventValidateSchemaChain, validateResults ,createEvent);
router.delete("/app/delete-event",isLoggedin, deleteEventValidateSchema,  validateResults , deleteEvent);
router.put("/app/update-event",isLoggedin, updateEventValidateSchema, validateResults , updateEvent);

export default router;