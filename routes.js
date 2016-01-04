// controllers
var userController = require('./controllers/UserController');
var eventController = require('./controllers/EventController');

module.exports = function(app, passport) {

    // index
    app.get('/', userController.index);

    //home
    app.get('/home', userController.home);

    // signin
    app.get('/signin', userController.signIn);
    //Todo have the sign-in post account for all of the errors in SigninPost
    app.post('/signin', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signin', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // signup
    app.get('/signup', userController.signUp);
    app.post('/signup', userController.signUpPost);

    //user profile
    app.get('/profile', userController.isLoggedIn, userController.profile);

    // logout
     app.get('/signout', userController.signOut);

    //create_event
    //uses route middleware to verify this (the isLoggedIn function)
    app.get('/create_event', userController.isLoggedIn, eventController.createEvent);
    app.post('/create_event', eventController.createEventPost);

    // 404 not found
    app.use(userController.notFound404);
};