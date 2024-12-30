import { body, query,check, checkSchema, validationResult} from "express-validator";
import validator from "validator"

const customV = (participants)=>{
    participants.forEach(email => {
        if(!validator.isEmail(email)){
            throw new Error("All participants in array should be valid email addresses")
        }
    });
    return true;
}

export const createUserValidationSchema = [
    body("username").exists({checkFalsy:true}).withMessage("A valid Name is required").isString().withMessage("Name must be string"),
    body("email").exists({checkFalsy:true}).withMessage("Email is required").isEmail().withMessage("Email must be valid")
];

export const getUserValidationSchema = [
    query("id").exists({checkFalsy:true}).withMessage("id field is required").isString().withMessage("id must be a string")
]

export const createEventValidateSchemaChain = [
    query("token").exists({checkFalsy:true}).withMessage("token is required").isString().withMessage("token must be a string"),
    query("userId").exists({checkFalsy:true}).withMessage("userId is required").isString("User ID must be a string"),
    body("title").exists({checkFalsy:true}).withMessage("Title is a required field").isString("Title must be a string"),
    body("description").exists({checkFalsy:true}).withMessage("Description is a required field").isString("Description must be a string"),
    body("startTime").exists({checkFalsy:true}).withMessage("Start time is a required field").isISO8601("Start time must be a ISO8601 string"),
    body("endTime").exists({checkFalsy:true}).withMessage("End time is a required field").isISO8601("End time must be a ISO8601 string"),
    body("participants").isArray().withMessage("Participants should be an array of valid email addresses.").custom(customV)
];

export const deleteEventValidateSchema = [
    query("token").exists({checkFalsy:true}).withMessage("token is required").isString().withMessage("token must be a string"),
    query("id").exists({checkFalsy:true}).withMessage("ID is a required Query Parameter").isString().withMessage("id must be string"),
    query("eventId").exists({checkFalsy:true}).withMessage("Event Id is a required Query Parameter").isString().withMessage("eventId must be string")
]

export const updateEventValidateSchema = [
    query("token").exists({checkFalsy:true}).withMessage("token is required").isString().withMessage("token must be a string"),
    query("id").exists({checkFalsy:true}).withMessage("Id is required").isString("ID must be a string"),
    query("eventId").exists({checkFalsy:true}).withMessage("eventId is required").isString("event ID must be a string"),
    body("title").exists({checkFalsy:true}).withMessage("Title is a required field").isString("Title must be a string"),
    body("description").exists({checkFalsy:true}).withMessage("Description is a required field").isString("Description must be a string"),
    body("startTime").exists({checkFalsy:true}).withMessage("Start time is a required field").isISO8601("Start time must be a ISO8601 string"),
    body("endTime").exists({checkFalsy:true}).withMessage("End time is a required field").isISO8601("End time must be a ISO8601 string"),
    body("participants").isArray().withMessage("Participants should be an array of valid email addresses.").custom(customV)
];
export const checkCustom = checkSchema({
    title: {
        exists:true,
        isString:true,
    },
    description:{
        exists:true,
        isString:true
    },
    startTime:{
        exists:true,
        isISO8601:true
    },
    endTime:{
        exists:true,
        isISO8601:true
    },
    date:{
        exists:true,
        isISO8601:true
    },
    participants:{
        isArray:true,
    }

}, ['body'])

export const validateResults = async (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.send({ errors: results.array() });
    }
    next();
}