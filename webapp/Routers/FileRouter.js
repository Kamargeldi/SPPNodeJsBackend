const express = require("express");
const fileRouter = express.Router();
const fileController = require("../Controllers/FileController.js");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const path = require("path");

fileRouter.use((request, response, next) => {
    var authtoken = request.cookies.authtoken;
    
    if (!authtoken)
    {
        response.status(401).json({message : "Unauthorized."});
        return;
    }

    jwt.verify(authtoken, tokenKey, (err, decoded) => {
        if (err)
        {
            console.log("Error: " + err.message);
            response.clearCookie("authtoken");
            response.status(401).json({message : "Unauthorized."});
            return;
        }
        
        next();
    });
});

fileRouter.post("/create", [
    body("filePath").custom((value) => {
        if (path.basename(value).trim() === '')
            return false;
        return true;
    }),
    body("fileContent").custom((value) => {
        return true;
    })],
    (request, response, next) => {
        var errors = validationResult(request);
        if (!errors.isEmpty())
        {
            response.status(422).json({message: errors.array()});
            console.log("Status: 422     Message: File create validation failed.");
            return;
        }

        next();
    },
    fileController.fileCreate
);


fileRouter.get("/list", fileController.fileList);


fileRouter.post("/download", [
    body("filePath").custom((value) => {
        if (path.basename(value).trim() === '')
            return false;
        return true;
    })],
    (request, response, next) => {
        var errors = validationResult(request);
        if (!errors.isEmpty())
        {
            response.status(422).json({message: errors.array()});
            console.log("Status: 422     Message: File download validation failed.");
            return;
        }

        next();
    },
    fileController.fileGet
);


fileRouter.post("/delete", [
    body("filePath").custom((value) => {
        if (path.basename(value).trim() === '')
            return false;
        return true;
    })],
    (request, response, next) => {
        var errors = validationResult(request);
        if (!errors.isEmpty())
        {
            response.status(422).json({message: errors.array()});
            console.log("Status: 422     Message: File delete validation failed.");
            return;
        }

        next();
    },
    fileController.fileDelete
);

module.exports = fileRouter;