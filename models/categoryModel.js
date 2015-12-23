var DB = require('./../config/db').DB;

var Category = DB.Model.extend({
    tableName: 'CATEGORY',
    idAttribute: 'CATEGORY_ID'
});

var getCategoryId = function (category_name) {
    new Model.Category({CATEGORY_NAME: category_name})
        .fetch()
        .then(function(model)  {
            return model.get('CATEGORY_ID')
        });
};


module.exports = {
    Category: Category,
    getCategoryId: getCategoryId
};