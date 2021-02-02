const express = require("express");
const homeRouter = express.Router();
const homeController = require("../Controllers/HomeController.js");


homeRouter.get("/", homeController.mainPage);

module.exports = homeRouter;