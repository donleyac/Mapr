// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

// custom library
// model
var Model = require('../models/User');

// index
var index = function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {

        var user = req.user;

        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('index', {title: 'Home', user: user});
    }
};

// sign in
// GET
var signInGet = function(req, res, next) {
    if(req.isAuthenticated()) res.redirect('/');
    res.render('signin', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/signin'}, function(err, user, info) {
        if(err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
        }

        if(!user) {
            return res.render('signin', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function(err) {
            if(err) {
                return res.render('signin', {title: 'Sign In', errorMessage: err.message});
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
};

// sign up
// GET
var signUpGet = function(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', {title: 'Sign Up'});
    }
};

/* Save a user */
// POST
var signUpPost = function(req, res, next) {
    var user = req.body;
    var usernamePromise;
    usernamePromise = new Model.Users({EMAIL_ADDRESS: user.email}).fetch();

    return usernamePromise.then(function(model) {
        if(model) {
            res.render('signup', {title: 'signup', errorMessage: 'email address already exists'});
        } else {
            //****************************************************//
            // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
            //****************************************************//
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            var signUpUser = new Model.Users({
                EMAIL_ADDRESS: user.email,
                FIRST_NAME: user.first_name,
                LAST_NAME: user.last_name,
                PASSWORD: hash
            });

            signUpUser.save().then(function(model) {
                // sign in the newly registered user
                signInPost(req, res, next);
                //res.json(model);
            });
        }
    })
};

// sign out
var signOut = function(req, res, next) {
    if(!req.isAuthenticated()) {
        notFound404(req, res, next);
    } else {
        req.logout();
        res.redirect('/signin');
    }
};

// 404 not found
var notFound404 = function(req, res, next) {
    res.status(404);
    res.render('404', {title: '404 Not Found'});
};

/* Get all users */
var getAllUsers = function (req, res) {
    new Model.Users().fetchAll()
        .then(function (users) {
            res.json(users);
        }).catch(function (error) {
        console.log(error);
        res.send('An error occured');
    })
};

/* Delete a user */
var deleteUser = function (req, res) {
    var userId = req.params.id;
    new Model.Users().where('USER_ACCOUNT_ID', userId)
        .destroy()
        .catch(function (error) {
            console.log(error);
            res.send('An error occured');
        });
};

/* Get a user */
var getUser = function (req, res) {
    var userId = req.params.id;
    new Model.Users().where('USER_ACCOUNT_ID', userId)
        .fetch()
        .then(function (user) {
            res.json(user);
        }).catch(function (error) {
        console.log(error);
        res.send('An error occured');
    });
};

// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signInGet = signInGet;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUpGet = signUpGet;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;