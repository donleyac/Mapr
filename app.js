// vendor libraries
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// custom libraries
// controllers
var userController = require('./controllers/UserController');
var eventController = require('./controllers/EventController');
// model
var userModel = require('./models/userModel');

var app = express();

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

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser());
app.use(session(
   {
      secret: 'secret strategic xxzzz code',
      resave: true,
      saveUninitialized: true
   }));
app.use(passport.initialize());
app.use(passport.session());

// GET
app.get('/', userController.index);

// signin
// GET
app.get('/signin', userController.signIn);
// POST
app.post('/signin', userController.signInPost);

// signup
// GET
app.get('/signup', userController.signUp);
// POST
app.post('/signup', userController.signUpPost);

// logout
// GET
app.get('/signout', userController.signOut);

//create_event
//GET
app.get('/create_event', eventController.createEvent);

//POST
app.post('/create_event', eventController.createEventPost);
/********************************/

/********************************/
// 404 not found
app.use(userController.notFound404);

var server = app.listen(app.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});

