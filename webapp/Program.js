const express = require("express");
const application = express();
const homeRouter = require("./Routers/HomeRouter.js");
const registerRouter = require("./Routers/RegisterRouter.js");
const loginRouter = require("./Routers/LoginRouter");
const fileRouter = require("./Routers/FileRouter.js");

application.use(express.urlencoded({extended : true}));
application.use(express.json());
application.set("view engine", "hbs");
application.set("views", "./webapp/View");
application.use("/Static", express.static(__dirname + "/Static"));
application.use("/", homeRouter);
application.use("/register", registerRouter);
application.use("/login", loginRouter);
application.use("/file", fileRouter);

application.use(function (req, res, next) 
{
    res.status(404).json({ message : "Not Found" });
});

application.listen(5000, "localhost", () => 
{
    console.log("Server started..");
});