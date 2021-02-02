const express = require("express");

exports.loginGet = function(request, response)
{
    response.status(200).send("Login get action.");
};


exports.loginPost = function(request, response)
{
    response.status(200).send("Login post action.");
};