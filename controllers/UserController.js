// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

// custom library
// model
var Model = require('./../models/userModel');

// index
var index = function(req, res, next) 
{
   if(!req.isAuthenticated()) 
   {

      res.redirect('/home');
   } else 
   {
      var user = req.user;

      if(user !== undefined) 
      {
         user = user.toJSON();
      }
      res.render('index', 
         {title: 'Home', user: user});
   }
};

var signIn = function(req, res, next) 
{
    if(req.isAuthenticated()) {
          res.redirect('/');
    }
    else {
          res.render('signin',
              {title: 'Sign In'});
      }
};

var signUp = function(req, res, next) 
{
   if(req.isAuthenticated())
   {
      res.redirect('/');
   } else
   {
      res.render('signup',
         {title: 'Sign Up'});
   }
};

var profile = function(req, res, next){
   res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
   });
};


var signOut = function(req, res, next)
{
   if(!req.isAuthenticated()) 
   {
      notFound404(req, res, next);
   } else 
   {
      req.logout();
      res.redirect('/signin');
   }
};

var notFound404 = function(req, res, next)
{
   res.status(404);
   res.render('404', 
      {title: '404 Not Found'});
};

var isLoggedIn = function(req,res,next) {
   // if user is authenticated in the session, carry on
   if (req.isAuthenticated())
      return next();

   // if they aren't redirect them to the home page
   res.redirect('/signin');
};

var home = function (req, res, next) {
    res.render('home',
        {title: 'Home Page'});
};

// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signIn = signIn;

// sign up
// GET
module.exports.signUp = signUp;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;

//logged in get
module.exports.isLoggedIn = isLoggedIn;

//profile get
module.exports.profile = profile;

module.exports.home = home;