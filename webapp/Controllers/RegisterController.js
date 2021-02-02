const express = require("express");
const dal = require("../DAL/DAL.js")
const bodyParser = require("body-parser");

exports.registerGet = function(request, response)
{
    response.status(200).send("Register get action.");
};


exports.registerPost = function(request, response)
{
    response.status(200).send("Register post action.");    
};