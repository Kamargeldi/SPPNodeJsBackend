const express = require("express");


exports.mainPage = function(request, response)
{
    response.status(200).send("Main page.");
    console.log("Status: 200     Message: Main page sent.");
}