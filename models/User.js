/**
 * Created by indycorps on 12/6/15.
 */
var DB = require('../config/db').DB;

var User = DB.Model.extend({
    tableName: 'USER_ACCOUNT',
    idAttribute: 'USER_ACCOUNT_ID',
    password: function() {
        return this.hasOne(Password);
    }
});

var Password = DB.Model.extend({
    tableName: 'PASSWORD',
    idAttribute: 'PASSWORD_ID',
    user: function() {
        return this.belongsTo(User);
    }
})

module.exports = {
    User: User,
    Password: Password
};
