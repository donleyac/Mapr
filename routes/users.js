var Model = require('./../models/User');

/* Save a user */
var saveUser = function (req, res) {
	new Model.User({
		EMAIL_ADDRESS: req.body.email,
		FIRST_NAME: req.body.first_name,
		LAST_NAME: req.body.last_name,
	}).save()
		.then(function (user) {
			res.json(user);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Get all users */
var getAllUsers = function (req, res) {
	new Model.User().fetchAll()
		.then(function (users) {
			res.json(users);
		}).catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Delete a user */
var deleteUser = function (req, res) {
	var userId = req.params.id;
	new Model.User().where('id', userId)
		.destroy()
		.catch(function (error) {
			console.log(error);
			res.send('An error occured');
		});
};

/* Get a user */
var getUser = function (req, res) {
	var userId = req.params.id;
	new Model.User().where('id', userId)
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
	saveUser: saveUser,
	getAllUsers: getAllUsers,
	deleteUser: deleteUser,
	getUser: getUser
};
