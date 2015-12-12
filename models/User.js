/**
 * Created by indycorps on 12/6/15.
 */
var DB = require('../config/db').DB;

var User = DB.Model.extend({
    tableName: 'USER_ACCOUNT',
    idAttribute: 'USER_ACCOUNT_ID',
    passwords: function() {
        return this.hasOne(Password);
    }
});

var Password = DB.Model.extend({
    tableName: 'PASSWORD',
    idAttribute: 'PASSWORD_ID',
    users: function() {
        return this.belongsTo(User);
    }
})

module.exports = {
    Users: User,
    Passwords: Password
};
