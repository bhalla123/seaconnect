const express = require('express')
const app = express();
const port = 3000;
var mongoose = require('mongoose');
var User = require('./models/user');
var bodyParser = require("body-parser");
var routes = require("./routes/route.js");


app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
mongoose.connect('mongodb://localhost:27017/seaconnect', { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")


//Routes
app.use(routes);


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});