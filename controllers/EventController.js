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

    var address = event.address_line1 + event.address_line2  + "," + event.city + "," + event.state;

    var latitude = 0;
    var longitude = 0;


    var geocoderProvider = 'google';
    var httpAdapter = 'https';
    // optional
    var extra = {
        apiKey: 'AIzaSyBRlE9HTsfYE_QFsg0vyvUUTrF0wEex8Fo'
    };

    var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

    geocoder.geocode(address, function(err, res) {

        console.log(Object.keys(res));
        //var newRes = res.toJSON();
        latitude = res[0].latitude;
        longitude = res[0].longitude;
       // var point = [latitude, longitude];

    }).then(function(model)
    {
        console.log("Coordinates are: " + latitude + "," + longitude);

        var createNewEvent = new eventModel.Event(
            {
                NAME: event.name,
                DESCRIPTION: event.description,
                ADDRESS_LINE1: event.address_line1,
                ADDRESS_LINE2: event.address_line2,
                CITY: event.city,
                STATE_PROVIDENCE: event.state,
                COORDINATES: [latitude, longitude],
                PRICE: 10,
                EVENT_START: event.event_start,
                EVENT_END: event.event_end,
                NUM_RECC: 0,
                NUM_DIS: 0,
                HOST_ID: user.USER_ACCOUNT_ID,
                CATEGORY_ID: 1
            });
        console.log(createNewEvent);

        createNewEvent.save().then(function(model) 
        {

            redirector(req, res, next);
            //console.log("Created new event model");
            
        }).otherwise(function(err) {
       console.log(err.stack);
        });

    });

    


};


var redirector = function(req, res, next) {
    console.log("Created new event model already");
    res.redirect('/');
};

module.exports.createEvent = createEvent;

module.exports.createEventPost = createEventPost;