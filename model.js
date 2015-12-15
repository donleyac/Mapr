var DB = require('./db').DB;

var User = DB.Model.extend({
   tableName: 'USER_ACCOUNT',
   idAttribute: 'USER_ACCOUNT_ID'
});

module.exports = {
   User: User
};