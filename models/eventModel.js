var DB = require('./../config/db').DB;

var Event = DB.Model.extend({
    tableName: 'EVENT',
    idAttribute: 'EVENT_ID'
});

module.exports = {
    Event: Event
};