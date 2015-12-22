var DB = require('./../config/db').DB;

var Event = DB.Model.extend({
    tableName: 'USER_ACCOUNT',
    idAttribute: 'USER_ACCOUNT_ID'
});

module.exports = {
    User: User
};