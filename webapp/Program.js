const express = require("express");
const application = express();
const homeRouter = require("./Routers/HomeRouter.js");
const registerRouter = require("./Routers/RegisterRouter.js");
const logoutRouter = require("./Routers/LogoutRouter.js");
const loginRouter = require("./Routers/LoginRouter");
const fileRouter = require("./Routers/FileRouter.js");
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const cookieParser = require("cookie-parser");
const datetime = require("date-and-time");
const bodyParser = require("body-parser");
const socketIO = require('socket.io');


application.use(express.urlencoded({extended : true}));
application.use(express.json());
application.use(cookieParser(tokenKey));
application.set("view engine", "hbs");
application.set("views", "./webapp/View");

application.use("/Static", express.static(__dirname + "/Static"));
application.use("/", homeRouter);
application.use("/register", registerRouter);
application.use("/login", loginRouter);
application.use("/logout", logoutRouter);
application.use("/file", fileRouter);

application.use(function (req, res, next) 
{
    res.status(404).json({ message : "Page not found." });
    console.log("Status: 404     Message: Page not found  " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));
});


const server = require('http').createServer(application);

const socket = socketIO(server);

const io = socketIO(server, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE']
    }
});


let interval;
io.on('connection', (socket) => {
    console.log("New client connected to WebSocket");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getCurrentTimeAndEmit(socket), 1000);
    socket.on("disconnect", () => {
    console.log("Client disconnected from WebSocket");
    clearInterval(interval);
    });
});


const getCurrentTimeAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("currentTime", response);
};


server.listen(5000, 'localhost', () => {
    console.log("Server started.. " + datetime.format(new Date(), "hh:mm:ss  DD-MM-YYYY."));    
});