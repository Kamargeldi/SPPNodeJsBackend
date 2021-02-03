const express = require("express");
const fstream = require("fs");
const path = require("path");
const dirJSON = require("directory-tree");
const { relative, resolve } = require("path");


exports.fileCreate = function(request, response)
{
    var fpath = request.body.filePath;
    var fcontent = request.body.fileContent;
    var fexists = fstream.existsSync(path.resolve(__dirname, "..") + "/UserData" + fpath);
    if (fexists)
    {
        response.status(409).json({message : "File already exists."});
    }
    else
    {
        fstream.writeFile(path.resolve(__dirname, "..") + "/UserData" + fpath, fcontent, (err) => {
            if (err)
            {
                console.log("Error: " + err.message);
                response.status(500).json({message : "Internal server error."});
                return;
            }

            response.status(201).json({message : "File created."});
        });
    }
};


exports.fileList = function(request, response){
    var directory = path.resolve(__dirname, "..") + "/UserData";
    var dirTree = dirJSON(directory, {normalizePath : true}, (item, fpath, stats) => {
        item.path = item.path.substr(path.resolve(__dirname, "..").length);
    }, (item, fpath, stats) => {
        item.path = item.path.substr(path.resolve(__dirname, "..").length);
    });
    response.status(200).json(dirTree);
};


exports.fileGet = function(request, response){
    var fpath = path.resolve(__dirname, "..") + "/UserData" + request.body.filePath;
    var fexists = fstream.existsSync(fpath);
    if (fexists)
    {
        fstream.readFile(fpath, (err, data) => {
            if (err)
            {
                console.log("Error: " + err.message);
                response.status(500).json({message : "Internal server error."});
                return;
            }

            response.status(200).json({fileContent : data.toJSON().data});
        });
    }
    else
    {
        response.status(404).json({error : "File not found."});
    }
};


exports.fileDelete = function(request, response){
    var fpath = path.resolve(__dirname, "..") + "/UserData" + request.body.filePath;
    var fexists = fstream.existsSync(fpath);
    if (fexists)
    {
        fstream.unlink(fpath, (err) => {
            if (err)
            {
                console.log("Error: " + err.message);
                response.status(500).json({message : "Internal server error."});
                return;
            }

            response.status(200).json({message : "File deleted."});
        });
    }
    else
    {
        response.status(404).json({message : "File not found."});
    }
};