const express = require("express");
const dal = require("../DAL/DAL.js")
const bodyParser = require("body-parser");

exports.registerGet = function(request, response)
{
    response.status(200).send("Register get action.");
};


exports.registerPost = function(request, response)
{
    var email = request.body.email;
    var password = request.body.password;
    dal.connection.query("insert into user(`email`, `password`) values(?, ?)", [email, password])
    .then((result) => {
        response.status(201).json("Register success.");
    }).catch((err) => {
        console.log("Error: " + err.message);
        response.status(409).json({message : "User already exists."});
    });
};