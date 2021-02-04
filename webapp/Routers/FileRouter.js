const express = require("express");
const fileRouter = express.Router();
const fileController = require("../Controllers/FileController.js");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const jwt = require("jsonwebtoken");

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

fileRouter.post("/create", fileController.fileCreate);
fileRouter.get("/list", fileController.fileList);
fileRouter.post("/download", fileController.fileGet);
fileRouter.post("/delete", fileController.fileDelete);

module.exports = fileRouter;