const express = require("express");
const fileRouter = express.Router();
const fileController = require("../Controllers/FileController.js");
const { body, validationResult } = require("express-validator");


fileRouter.post("/create", fileController.fileCreate);
fileRouter.get("/list", fileController.fileList);
fileRouter.post("/download", fileController.fileGet);
fileRouter.post("/delete", fileController.fileDelete);

module.exports = fileRouter;