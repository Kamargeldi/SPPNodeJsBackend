const express = require("express");
const jwt = require("jsonwebtoken");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const dal = require("../DAL/DAL.js");
const datetime = require("date-and-time");


exports.loginGet = function(request, response)
{
    response.status(200).send("Login get action.");
    console.log("Status: 200     Message: Login page sent  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
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
                response.setHeader("Authorization", jwt.sign({ id: element[0].id, email: email}, tokenKey, {expiresIn : "60m"}));
                response.status(200)
                .json({message: "Authorization sent."});
                console.log("Status: 200     Message: Auth Token header sent  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
                exists = true;
            }
        });

        if (!exists)
        {
            response.status(404).json({message : "User not found or wrong password."});
            console.log("Status: 404     Message: User not found or wrong password  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
        }
    })
    .catch((err) => {
        console.log("Error: ", err.message);
        response.status(500).json({message : "Internal server error."});
        console.log("Status: 500     Message: Internal server error  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
    });
};



exports.logoutPost = function(request, response)
{
    var token = request.cookies.authtoken;
    if (token)
    {
        response.clearCookie("authtoken");
        response.status(200).json("Log out success.");
        console.log("Status: 200     Message: User logged out  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
    }
}