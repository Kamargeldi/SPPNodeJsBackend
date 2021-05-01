const express = require("express");
const fstream = require("fs");
const path = require("path");
const datetime = require("date-and-time");
const jwt = require("jsonwebtoken");
const dal = require("../DAL/DAL");
const { Stream } = require("stream");
const FormData = require('form-data');

exports.fileCreate = function(request, response)
{
    var userId = jwt.decode(request.get("Authorization"))["id"];
    var fpath = request.body.fileName;
    var fcontent = request.file;
    var fexists = fstream.existsSync(path.resolve(__dirname, "..") + "/UserData/" + userId + "/" + fpath);
    if (fexists)
    {
        response.status(409).json({message : "File already exists."});
        console.log("Status: 409     Message: File already exists  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
    }
    else
    {
        dal.connection.query("insert into file(`filename`, `user_id`, `type`, `size`) values(?, ?, ?, ?)",
        [fpath, userId, path.extname(fpath), 0])
        .then((value) => {
            
            var dir = path.dirname(path.resolve(__dirname, '..' + "/UserData/" + userId + "/" + fpath));
            if (!fstream.existsSync(dir))
                fstream.mkdirSync(dir, {recursive: true});
            
                
            
            fstream.writeFile(path.resolve(__dirname, "..") + "/UserData/" + userId + "/" + fpath, fcontent.buffer, {}, (err) => {
                if (err)
                {
                    console.log("Error: " + err.message);
                    response.status(500).json({message : "Internal server error."});
                    console.log("Status: 500     Message: Internal server error  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
                    return;
                }

                dal.connection.query("update `storage`.`file` SET `size` = ? WHERE (`id` = ?)",
                [
                    fstream.statSync(path.resolve(__dirname, "..") + "/UserData/" + userId + "/" + fpath).size,
                    value[0].insertId
                ]).then((setResult) => {
                    response.status(201).json({message : "File created."});
                    console.log("Status: 201     Message: File created  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
                });
            });
        });
    }
};


exports.fileList = function(request, response){
    var userId = jwt.decode(request.get("Authorization"))["id"];
    dal.connection.query("select filename, type, size from file where user_id = ?", [userId])
    .then((result) => {
        response.status(200).json(result[0]);
        console.log("Status: 200     Message: File list sent to client  "  + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
    });
};


exports.fileGet = function(request, response){
    var userId = jwt.decode(request.get("Authorization"))["id"];
    var fpath = path.resolve(__dirname, "..") + "/UserData/" + userId + "/" + request.body.filePath;
    dal.connection.query("select * from file where filename = ? and user_id = ?", 
    [request.body.filePath, userId])
    .then((value) => {

        if (value[0].length !== 0)
        {
            fstream.readFile(fpath, (err, data) => {
                if (err)
                {
                    console.log("Error: " + err.message);
                    response.status(500).json({message : "Internal server error."});
                    console.log("Status: 500     Message: Internal server error  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
                    return;
                }
                response.status(200).send(data);
                console.log("Status: 200     Message: File sent to client  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
            });
        }
        else
        {
            response.status(404).json({error : "File not found."});
            console.log("Status: 404     Message: File not found  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
        }
    });
};


exports.fileDelete = function(request, response){
    var userId = jwt.decode(request.get("Authorization"))["id"];
    var fpath = path.resolve(__dirname, "..") + "/UserData/" + userId + "/" + request.body.filePath;
    dal.connection.query("select * from file where filename = ? and user_id = ?", 
    [request.body.filePath, userId])
    .then((value) => {
        if (value[0].length !== 0)
        {
            fstream.unlink(fpath, (err) => {
                if (err)
                {
                    console.log("Error: " + err.message);
                    response.status(500).json({message : "Internal server error."});
                    console.log("Status: 500     Message: Internal server error  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
                    return;
                }

                dal.connection.query("delete from file where id = ?", [value[0][0].id])
                .then((result) => {          
                    response.status(200).json({message : "File deleted."});
                    console.log("Status: 200     Message: File deleted  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
            
                });
            });
        }
        else
        {
            response.status(404).json({message : "File not found."});
            console.log("Status: 404     Message: File not found  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
        }
    });
};


exports.fileExists = function(request, response){
    var userId = jwt.decode(request.get("Authorization"))["id"];
    var fpath = path.resolve(__dirname, "..") + "/UserData/" + userId + "/" + request.body.filePath;
    dal.connection.query("select * from file where filename = ? and user_id = ?", 
    [request.body.filePath, userId])
    .then((value) => {

        if (value[0].length !== 0)
        {
            response.status(200).json({message: 'File already exists.'});
        }

        if (value[0].length === 0)
        {
            response.status(404).json('File not found.');
        }
    });
}