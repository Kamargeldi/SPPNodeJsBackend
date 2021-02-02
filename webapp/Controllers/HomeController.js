const express = require("express");


exports.mainPage = function(request, response)
{
    response.status(200).send("Main page.");
}