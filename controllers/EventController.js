// model
var eventModel = require('./../models/eventModel');
var categoryModel = require('./../models/categoryModel');
var userController = require('./UserController');


// sign up
// GET
var createEvent = function(req, res, next) {

    console.log(req.user);
    userController.loggedIn(req,res,next);
    console.log("Called the event GET");

       var user = req.user;

      if(user !== undefined) 
      {
         user = user.toJSON();
      }
      console.log(user);
    res.render('create_event',
        {title: 'Create Event'});

    
};

//POST
var createEventPost = function(req, res, next) {

    console.log("Called the event POST");

    var event = req.body;
   

      var user = req.user;

      if(user !== undefined) 
      {
         user = user.toJSON();
      }


    var createNewEvent = new eventModel.Event(
        {
            NAME: event.name,
            DESCRIPTION: event.description,
            ADDRESS_LINE1: event.address_line1,
            ADDRESS_LINE2: event.address_line2,
            CITY: event.city,
            STATE_PROVIDENCE: event.state,
            LAT: 5435345.54534,
            LONG: 534453.53453453,
            PRICE: 0,
            EVENT_STATE: event.event_start,
            EVENT_END: event.event_end,
            NUM_RECC: event.num_recc,
            NUM_DIS: event.num_dis,
            HOST_ID: user.USER_ACCOUNT_ID,
            CATEGORY_ID: 1
        });
    console.log(createNewEvent);

    createNewEvent.save().then(function(model) 
    {

        redirector(req, res, next);
        //console.log("Created new event model");
        
    });
};


var redirector = function(req, res, next) {
    console.log("Created new event model already");
    res.redirect('/');
};

module.exports.createEvent = createEvent;

module.exports.createEventPost = createEventPost;