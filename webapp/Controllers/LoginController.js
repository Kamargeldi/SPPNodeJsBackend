const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';

exports.loginGet = function(request, response)
{
    response.status(200).send("Login get action.");
};


exports.loginPost = function(request, response)
{
    
};