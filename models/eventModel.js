var DB = require('./../config/db').DB;
var userModel = require('./userModel');

var Event = DB.Model.extend({
    tableName: 'EVENT',
    idAttribute: 'EVENT_ID',
    hosts: function() {
        return this.belongsToMany(userModel);
    }
});

module.exports = {
    Event: Event
};