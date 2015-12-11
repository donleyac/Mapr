var Model = require('./../models/User');

/* Save a user */
var saveUser = function (req, res) {
	new Model.User({
		EMAIL_ADDRESS: req.body.email,
		FIRST_NAME: req.body.first_name,
		LAST_NAME: req.body.last_name
	}).save();

	//Todo save password directly into User through FK
	new Model.Password({
		PASSWORD: req.body.password,
		USER_ACCOUNT_ID: req.params.id
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
//ToDo Fetch all the user information and the password associate with it.
    //new Model.Password.where({USER_ACCOUNT_ID: req.params.id}).fetch({withRelated: ['USER_ACCOUNT']}).then(function(password) {
    //  console.log(JSON.stringify(password.related('USER_ACCOUNT')));
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
