/**
 * Created by indycorps on 12/6/15.
 */
var Bookshelf = require('bookshelf');

var config = {
    host: 'localhost',  // your host
    user: 'indycorps', // your database user
    password: 'password', // your database password
    database: 'eventmapper',
    charset: 'UTF8_GENERAL_CI'
};

var DB = Bookshelf.initialize({
    client: 'pg',
    connection: config
});

module.exports.DB = DB;