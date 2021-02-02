const mySql = require("mysql2");

const connection = mySql.createPool({
       connectionLimit: 5,
       host: "localhost",
       user: "root",
       database: "storage",
       password: "kmprojects", 
}).promise();


exports.connection = connection;