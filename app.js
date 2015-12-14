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
// routes
var route = require('./routes/users');
// model
var Model = require('./models/User');

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
	new Model.Users({'EMAIL_ADDRESS': username}).fetch().then(function(data) {
		console.log("Username");
		console.log(username);
		console.log("Inputted Password:");
		console.log(password);
		console.log("Actual Password");
		console.log(data.get('PASSWORD'));
		var user = data;
		if(user === null) {
			return done(null, false, {message: 'Invalid username or password'});
		} else {
			user = data.toJSON();
			console.log("LOCAL_STRATEGY user to JSON");
			if(!bcrypt.compareSync(password, data.get('PASSWORD'))) {
				return done(null, false, {message: 'Invalid username or password'});
			} else {
				console.log("Successful Password");
				return done(null, user);
			}
		}
	});
}));


passport.serializeUser(function(user, done) {
	done(null,user);
});

passport.deserializeUser(function(user, done) {
	new Model.Users({EMAIL_ADDRESS: user.username}).fetch().then(function(user) {
		done(null, user);
	});
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: 'secret strategic xxzzz code'}));
app.use(passport.initialize());
app.use(passport.session());

// GET
app.get('/', route.index);

// signin
// GET
app.get('/signin',route.signInGet);
// POST
app.post('/signin', route.signInPost);

// signup
// GET
app.get('/signup', route.signUpGet);
// POST
app.post('/signup', route.signUpPost);

// logout
// GET
app.get('/signout', route.signOut);

/********************************/

/********************************/
// 404 not found
app.use(route.notFound404);

var server = app.listen(app.get('port'), function(err) {
	if(err) throw err;

	var message = 'Server is running @ http://localhost:' + server.address().port;
	console.log(message);
});

