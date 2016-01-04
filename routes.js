// controllers
var userController = require('./controllers/UserController');
var eventController = require('./controllers/EventController');

module.exports = function(app, passport) {
    // index
        app.get('/', userController.index);

    // signin
        app.get('/signin', userController.signIn);
        app.post('/signin', userController.signInPost);

    // signup
        app.get('/signup', userController.signUp);
         app.post('/signup', userController.signUpPost);

    // logout
         app.get('/signout', userController.signOut);

    //create_event
        //uses route middleware to verify this (the isLoggedIn function)
        app.get('/create_event', userController.isLoggedIn, eventController.createEvent);
        app.post('/create_event', eventController.createEventPost);

    // 404 not found
    app.use(userController.notFound404);
};