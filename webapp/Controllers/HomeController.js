const express = require("express");
const datetime = require("date-and-time");


exports.mainPage = function(request, response)
{
    response.status(200).send("Main page.");
    console.log("Status: 200     Message: Main page sent  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
}