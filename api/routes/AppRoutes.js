import { Router } from "express";
import { createEvent, deleteEvent, failureRedirect, getUser, updateEvent } from "../contollers/AppController.js";
import { isLoggedin } from "../middlewares/auth.js";
import { createEventValidateSchemaChain, deleteEventValidateSchema, updateEventValidateSchema, validateResults } from "../utils/validator.js";

const router = Router();

router.get("/app/getUser", isLoggedin, getUser);
router.get("/failure", failureRedirect);
router.post("/app/create-event", createEventValidateSchemaChain, validateResults ,createEvent);
router.delete("/app/delete-event", deleteEventValidateSchema,  validateResults , deleteEvent);
router.put("/app/update-event", updateEventValidateSchema, validateResults , updateEvent);

export default router;