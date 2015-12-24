var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
// model
var userModel = require('./../models/userModel');

module.exports = function(passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.EMAIL_ADDRESS);
    });

    passport.deserializeUser(function (username, done) {
        new userModel.User({EMAIL_ADDRESS: username}).fetch().then(function (user) {
            done(null, user);
        });
    });

    passport.use('local-signin', new LocalStrategy( {
        passReqToCallback : true
    },
    function(req, username, password, done) {
        new userModel.User({EMAIL_ADDRESS: username}).fetch().then(function (data) {
            var user = data;
            if (user === null) {
                return done(null, false, {message: 'Invalid username or password'});
            } else {
                user = data.toJSON();
                if (!bcrypt.compareSync(password, data.get('PASSWORD'))) {
                    return done(null, false, {message: 'Invalid username or password'});
                } else {
                    return done(null, user);
                }
            }
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true
    },
        function (req, username, password, done)
        {
        new userModel.User({EMAIL_ADDRESS: username}).fetch().then(function (model) {
            if (model) {
                res.render('signup',
                    {title: 'signup', errorMessage: 'username already exists'});
            } else {
                //****************************************************//
                // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
                //****************************************************//
                var hash = bcrypt.hashSync(password);

                var signUpUser = new userModel.User(
                    {
                        EMAIL_ADDRESS: username,
                        PASSWORD: hash,
                        NAME: req.body.name
                    });
                signUpUser.save().then(function(data)
                {
                    return done(null, data.toJSON());
                }).otherwise(function(err) {
                    console.log(err.stack);
                });
            }
        }).otherwise(function(err) {
            console.log(err.stack);
        });
    }));
};