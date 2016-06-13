require('dotenv').load();
var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');


var plantexplorer = require('./routes/plantexplorer');
var uploads = require('./routes/uploads');

var passport = require('./strategies/userStrategy');
var session = require('express-session');


var index = require('./routes/index');
var user = require('./routes/user');
var register = require('./routes/register');


// middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// express routes

app.use('/plantexplorer', plantexplorer);
app.use('/uploads', uploads);
app.use('/register', register);
app.use('/user', user);
app.use('/*', index);

// mongoose connection
if(process.env.MONGODB_URI!= undefined) {
  var connectionString = process.env.MONGODB_URI + "?ssl=true";
} else {
    var connectionString = 'mongodb://localhost:27017/mu';
}

//var databaseURI = 'mongodb://localhost:27017/mu';

mongoose.connect(connectionString);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open ', connectionString);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose error connecting ', err);
});
// Handle index file separately
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './public/views/index.html'));
})

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
