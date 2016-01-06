// Models
var eventModel = require('./../models/eventModel');
var categoryModel = require('./../models/categoryModel');

//Controllers
var userController = require('./UserController');

//Google Maps API Information
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {apiKey: 'AIzaSyBRlE9HTsfYE_QFsg0vyvUUTrF0wEex8Fo'};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);


// GET
var createEvent = function(req, res, next) {
    res.render('create_event',
        {title: 'Create Event'});
};

//POST
var createEventPost = function(req, res, next) {

    //Form Declaration
    var event = req.body;
    var user = req.user;

    if(user !== undefined) 
    {
     user = user.toJSON();
    }

    //Location Declaration
    var address = event.address_line1 + event.address_line2  + "," + event.city + "," + event.state;
    var latitude;
    var longitude;

    //Address Geocode Promise
    geocoder.geocode(address, function(err, res) {
        latitude = res[0].latitude;
        longitude = res[0].longitude;
    }).then(function(model)
    {
        //Create Event Model
        var createNewEvent = new eventModel.Event(
            {
                NAME: event.name,
                DESCRIPTION: event.description,
                ADDRESS_LINE1: event.address_line1,
                ADDRESS_LINE2: event.address_line2,
                CITY: event.city,
                STATE_PROVIDENCE: event.state,
                //Todo COORDINATES: "ST_GeomFromText('POINT(" + longitude + " " + latitude  + ")',4326)",
                LONGITUDE: longitude,
                LATITUDE: latitude,
                //Todo change price to double-precision
                PRICE: 10,
                EVENT_START: event.event_start,
                EVENT_END: event.event_end,
                NUM_RECC: 0,
                NUM_DIS: 0,
                HOST_ID: user.USER_ACCOUNT_ID,
                CATEGORY_ID: 1
                //Todo Add the status of an event
                //Todo Add explicit drop to secret_code
            });
        createNewEvent.save().then(function(model)
        {
            redirector(req, res, next);
        }).otherwise(function(err) {
            console.log(err.stack);
        });

    });
};

var redirector = function(req, res, next) {
    res.redirect('/');
};


// GET
var viewSingleEvent = function(req, res, next) {

    var eventID = req.query.eventID;
    if(eventID===null)
    {
        eventID=1;
    }
    var event = new eventModel.Event({EVENT_ID : eventID}).fetch().then(function(data)
    {
        var newEvent = data;
        console.log(newEvent);
        res.render('event',
            {title: 'View Event: ', event : newEvent});
    });
};

module.exports.createEvent = createEvent;
module.exports.createEventPost = createEventPost;
module.exports.viewSingleEvent = viewSingleEvent;