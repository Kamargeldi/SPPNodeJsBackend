const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const dal = require("../DAL/DAL.js");

exports.loginGet = function(request, response)
{
    response.status(200).send("Login get action.");
};


exports.loginPost = function(request, response)
{
    var email = request.body.email;
    var password = request.body.password;
    var exists = false;
    dal.connection.query("select * from user where email = ?", [email])
    .then((result) => {
        result.forEach(element => {
            if (element[0].email === email && element[0].password === password)
            {
                response.status(200)
                .cookie("authtoken", jwt.sign({ id: element[0].id, email: email}, tokenKey, {expiresIn : "60s"}), {httpOnly: true})
                .json({message: "Set cookie."});
                exists = true;
            }
        });

        if (!exists)
            response.status(404).json({message : "User not found or wrong password."});
    })
    .catch((err) => {
        console.log("Error: ", err.message);
        response.status(500).json({message : "Internal server error."});
    });
};