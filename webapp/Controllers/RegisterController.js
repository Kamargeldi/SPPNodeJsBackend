const express = require("express");
const dal = require("../DAL/DAL.js")



exports.registerGet = function(request, response)
{
    response.status(200).send("Register get action.");
    console.log("Status: 200     Message: Register page sent.");
};


exports.registerPost = function(request, response)
{
    var email = request.body.email;
    var password = request.body.password;
    dal.connection.query("insert into user(`email`, `password`) values(?, ?)", [email, password])
    .then((result) => {
        response.status(201).json({message : "Register success."});
        console.log("Status: 201     Message: Register success.");
    }).catch((err) => {
        console.log("Error: " + err.message);
        response.status(409).json({message : "User already exists."});
        console.log("Status: 409     Message: User already exists.");
    });
};