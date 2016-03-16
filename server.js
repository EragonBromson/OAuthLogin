var express = require('express');

var app = express();
var port = 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var morgan = require('morgan');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(morgan('dev')); //logger

app.use(cookieParser()); //parse every cookie
app.use(session({
  secret: "anystring",
  saveUninitialized : true,
  resave : true
}));

// app.get('/', function(request,response) {
//   response.send("You are on port: " + port + ".");
//   console.log(request.cookies);
//   console.log("\n");
//   console.log(request.session);
// });

require('./app/routes.js')(app);

app.listen(port);
