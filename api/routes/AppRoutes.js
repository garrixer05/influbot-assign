import { Router } from "express";
import { createEvent, createUser, deleteEvent, failureRedirect, getUser, updateEvent } from "../contollers/AppController.js";
import { isLoggedin, psp, verifyToken } from "../middlewares/auth.js";
import { createEventValidateSchemaChain, createUserValidationSchema, deleteEventValidateSchema, getUserValidationSchema, updateEventValidateSchema, validateResults } from "../utils/validator.js";

const router = Router();

router.get("/app/getUser",getUserValidationSchema, validateResults ,getUser);
router.get("/failure", failureRedirect);

router.post("/app/create-user",createUserValidationSchema, validateResults ,createUser)
router.post("/app/create-event",createEventValidateSchemaChain, validateResults ,createEvent);
router.delete("/app/delete-event", deleteEventValidateSchema,  validateResults , deleteEvent);
router.put("/app/update-event", updateEventValidateSchema, validateResults , updateEvent);

export default router;