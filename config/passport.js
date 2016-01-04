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

    passport.use('local-login', new LocalStrategy(function (username, password, done) {
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
};