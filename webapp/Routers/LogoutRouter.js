const { request, response } = require("express");
const express = require("express");
const logoutRouter = express.Router();
const loginController = require("../Controllers/LoginController.js");



logoutRouter.use(loginController.logoutPost);

module.exports = logoutRouter;