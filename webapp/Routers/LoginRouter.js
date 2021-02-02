const express = require("express");
const loginRouter = express.Router();
const loginController = require("../Controllers/LoginController.js");
const { body, validationResult } = require("express-validator");


loginRouter.get("/", loginController.loginGet);


loginRouter.post("/", [
body("email").trim().isEmail().withMessage("Not a valid email."),
body("password").trim().isLength({ min: 5 }).withMessage("Password must be at least 5 chars."),
], 
(request, response, next) => {
    var errors = validationResult(request);
    if (!errors.isEmpty())
    {
        response.status(422).json({ message : errors.array() });
        return;
    }

    next();
}
,loginController.loginPost);






module.exports = loginRouter;