const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const dal = require("../DAL/DAL.js");

exports.loginGet = function(request, response)
{
    response.status(200).send("Login get action.");
    console.log("Status: 200     Message: Login page sent.");
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
                .cookie("authtoken", jwt.sign({ id: element[0].id, email: email}, tokenKey, {expiresIn : "1m"}), {httpOnly: true})
                .json({message: "Set cookie."});
                console.log("Status: 200     Message: Auth Token cookie sent.");
                exists = true;
            }
        });

        if (!exists)
        {
            response.status(404).json({message : "User not found or wrong password."});
            console.log("Status: 404     Message: User not found or wrong password.");
        }
    })
    .catch((err) => {
        console.log("Error: ", err.message);
        response.status(500).json({message : "Internal server error."});
        console.log("Status: 500     Message: Internal server error.");
    });
};



exports.logoutPost = function(request, response)
{
    var token = request.cookies.authtoken;
    if (token)
    {
        response.clearCookie("authtoken");
        response.status(200).json("Log out success.");
        console.log("Status: 200     Message: User logged out.");
    }
}