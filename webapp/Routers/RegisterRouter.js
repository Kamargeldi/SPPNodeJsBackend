const express = require("express");
const registerRouter = express.Router();
const registerController = require("../Controllers/RegisterController.js");
const { body, validationResult } = require("express-validator");


registerRouter.get("/", registerController.registerGet);


registerRouter.post("/", [
body("email").trim().isEmail().withMessage("Not a valid email."),
body("password").trim().isLength({ min: 5 }).withMessage("Password must be at least 5 chars."),
body("confirm").trim().isLength({ min : 5 }).withMessage("Password confirm must be at least 5 chars.")
.custom((value, { req }) => {
    if (value !== req.body.password) {
        return false;
    }
    return true;
}).withMessage("Password not matches with confirmation.")],
(request, response, next) => {
    var errors = validationResult(request);
    if (!errors.isEmpty())
    {
        response.status(422).json({message: errors.array()});
        return;
    }

    next();
},
registerController.registerPost);



module.exports = registerRouter;