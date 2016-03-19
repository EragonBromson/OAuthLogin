var express = require('express');

var app = express();
var port = 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);

//Initializing middlewares
app.use(morgan('dev')); //logger

app.use(cookieParser()); //parse every cookie
app.use(session({
  secret: "anystring",
  saveUninitialized : true,
  resave : true
}));
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());  // uses the session created above
app.use(flash());


app.set('view engine', 'ejs');

// app.get('/', function(request,response) {
//   response.send("You are on port: " + port + ".");
//   console.log(request.cookies);
//   console.log("\n");
//   console.log(request.session);
// });

require('./app/routes.js')(app, passport);
app.use(express.static(__dirname + '/public'));

app.listen(port);
