const express = require('express')
const app = express();
const port = 3000;
var mongoose = require('mongoose');
var User = require('./models/user');
var bodyParser = require("body-parser");


// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
//mongoose.connect(
//'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false/seaconnect', { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb://localhost:27017/seaconnect', { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")


//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));  

var routes = require("./routes/route.js");

//Routes
app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});