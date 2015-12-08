/**
 * Created by indycorps on 12/6/15.
 */
var DB = require('../config/db').DB;

var User = DB.Model.extend({
    tableName: 'USER_ACCOUNT',
    idAttribute: 'USER_ACCOUNT_ID',
});

module.exports = {
    User: User
};
