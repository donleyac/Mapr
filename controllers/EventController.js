// model
var eventModel = require('./../models/eventModel');
var categoryModel = require('./../models/categoryModel');
var userController = require('./UserController');


// sign up
// POST
var createEvent = function(req, res, next) {

    userController.loggedIn(req,res,next);

    var event = req.body;

    var signUpUser = new eventModel.Event(
        {
            NAME: event.name,
            DESCRIPTION: event.description,
            ADDRESS_LINE1: event.address_line1,
            ADDRESS_LINE2: event.address_line2,
            CITY: event.city,
            STATE_PROVIDENCE: event.state,
            LAT: event.lat,
            LONG: event.long,
            PRICE: event.price,
            EVENT_STATE: event.event_start,
            EVENT_END: event.event_end,
            NUM_RECC: event.num_recc,
            NUM_DIS: event.num_dis,
            HOST_ID: req.user.USER_ACCOUNT_ID,
            CATEGORY_ID: categoryModel.getCategoryId(req,res,next)
        });

    signUpUser.save().then(function (model) {
        // sign in the newly registered user
        res.redirect('/');
    });
};

module.exports.createEvent = createEvent;