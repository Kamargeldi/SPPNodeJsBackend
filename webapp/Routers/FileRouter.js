const express = require("express");
const fileRouter = express.Router();
const fileController = require("../Controllers/FileController.js");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const path = require("path");
const datetime = require("date-and-time");
const multer = require('multer');

fileRouter.use((request, response, next) => {
    var authtoken = request.get("Authorization");
    
    if (!authtoken)
    {
        response.status(401).json({message : "Unauthorized."});
        console.log("Status: 401     Message: Unauthorized  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
        return;
    }

    jwt.verify(authtoken, tokenKey, (err, decoded) => {
        if (err)
        {
            console.log("Error: " + err.message);
            response.status(401).json({message : "Unauthorized."});
            console.log("Status: 401     Message: Unauthorized  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
            return;
        }

        next();
    });
});


const upload = multer();
fileRouter.post("/create", upload.single('file'), [body('formData').custom((value) => {return true;})],
    (request, response, next) => {
        var errors = validationResult(request);
        if (!errors.isEmpty())
        {
            response.status(422).json({message: errors.array()});
            console.log("Status: 422     Message: File create validation failed  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
            return;
        }

        next();
    },
    fileController.fileCreate
);


fileRouter.get("/list", fileController.fileList);


fileRouter.post("/get", [
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
            console.log("Status: 422     Message: File download validation failed  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
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
            console.log("Status: 422     Message: File delete validation failed  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
            return;
        }

        next();
    },
    fileController.fileDelete
);

fileRouter.post("/exists", [
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
            console.log("Status: 422     Message: File delete validation failed  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
            return;
        }

        next();
    },
    fileController.fileExists
);

module.exports = fileRouter;