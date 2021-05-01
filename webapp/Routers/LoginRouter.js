const express = require("express");
const loginRouter = express.Router();
const loginController = require("../Controllers/LoginController.js");
const { body, validationResult } = require("express-validator");
const datetime = require("date-and-time");


loginRouter.get("/", loginController.loginGet);


loginRouter.post("/", [
body("email").trim().isEmail().withMessage("Not a valid email."),
body("password").trim().isLength({ min: 5 }).withMessage("Password must be at least 5 chars."),
], 
(request, response, next) => {
    var errors = validationResult(request);
    if (!errors.isEmpty())
    {
        response.status(422).json({ message : errors.array()[0].msg });
        console.log("Status: 422     Message: Login validation failed  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
        return;
    }

    next();
}, 
loginController.loginPost);






module.exports = loginRouter;