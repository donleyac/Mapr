// vendor libraries
var express = require('express');
var app = express();
var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');

var LocalStrategy = require('passport-local').Strategy;

// model
var userModel = require('./models/userModel');


passport.use(new LocalStrategy(function(username, password, done) {
   new userModel.User({EMAIL_ADDRESS: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, data.get('PASSWORD'))) {
            return done(null, false, {message: 'Invalid username or password'});
         } else {
            return done(null, user);
         }
      }
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.EMAIL_ADDRESS);
});

passport.deserializeUser(function(username, done) {
   new userModel.User({EMAIL_ADDRESS: username}).fetch().then(function(user) {
      done(null, user);
   });
});

app.set('port', process.env.PORT || 3000); //launch application at this port
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser()); //get information from html forms
app.use(session(
   {
      secret: 'secret strategic xxzzz code',
      resave: true,
      saveUninitialized: true
   }));
app.use(passport.initialize());
app.use(passport.session());

// routes ======================================================================
require('./routes.js')(app, passport);

// launch ======================================================================
var server = app.listen(app.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});

