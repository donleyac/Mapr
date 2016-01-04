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

//Todo Remove after moving the signUpPost to passport.js
var signInPost = function(req, res, next)
{
   passport.authenticate('local-login',
      { 
         successRedirect: '/',
         failureRedirect: '/signin'}, function(err, user, info) 

         {
      if(err) 
      {
         return res.render('signin', 
            {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) 
      {
         return res.render('signin', 
            {title: 'Sign In', errorMessage: info.message});
      }
      return req.logIn(user, function(err) 
      {
         if(err) 
         {
            return res.render('signin', 
               {title: 'Sign In', errorMessage: err.message});
         } else 
         {
            return res.redirect('/');
         }
      });
   })(req, res, next);
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
//Todo Move to passport.js as the local signup strategy
var signUpPost = function(req, res, next) 
{
   var user = req.body;
   var usernamePromise = new Model.User(
      {EMAIL_ADDRESS: user.username}).fetch();

   return usernamePromise.then(function(model) 
   {
      if(model) 
      {
         res.render('signup', 
            {title: 'signup', errorMessage: 'username already exists'});
      } 
      else 
      {
         //****************************************************//
         // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
         //****************************************************//
         var password = user.password;
         var hash = bcrypt.hashSync(password);

         var signUpUser = new Model.User(
            {
               EMAIL_ADDRESS: user.username, 
               PASSWORD: hash,
               NAME: user.name
            });
          console.log('saving');
         signUpUser.save().then(function(model) 
         {
            // sign in the newly registered user
            signInPost(req, res, next);
         });	
      }
   }).otherwise(function(err) {
       console.log(err.stack);
   });
};

var profile = function(req, res, next){

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
// POST
//module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;

//logged in get
module.exports.isLoggedIn = isLoggedIn;

//profile get
module.exports.profile = profile;

module.exports.home = home;