var Model = require('./../models/User');
var bcrypt = require('bcrypt-nodejs');
/* Save a user */
// POST
var signUpPost = function(req, res, next) {
    var user = req.body;
    var usernamePromise = null;
    usernamePromise = new Model.Users({EMAIL_ADDRESS: user.email}).fetch();

    return usernamePromise.then(function(model) {
        if(model) {
            res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
        } else {
            //****************************************************//
            // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
            //****************************************************//
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            var signUpUser = new Model.Users({
                EMAIL_ADDRESS: user.email,
                FIRST_NAME: user.first_name,
                LAST_NAME: user.last_name,
                PASSWORD: hash
            });

            signUpUser.save().then(function(model) {
                // sign in the newly registered user
                //signInPost(req, res, next);
                res.json(model);
            });
        }
    })
};

/* Get all users */
var getAllUsers = function (req, res) {
	new Model.Users().fetchAll()
			.then(function (users) {
				console.log(JSON.stringify(users));
				res.json(users);
			}).catch(function (error) {
        console.log(error);
        res.send('An error occured');
    })
};

/* Delete a user */
var deleteUser = function (req, res) {
	var userId = req.params.id;
	new Model.Users().where('id', userId)
		.destroy()
		.catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Get a user */
var getUser = function (req, res) {
	var userId = req.params.id;
	new Model.UserS().where('id', userId)
		.fetch()
		.then(function (user) {
			res.json(user);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Exports all methods */
module.exports = {
    saveUser: signUpPost,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    getUser: getUser
};

