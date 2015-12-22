var DB = require('./../config/db').DB;

var Category = DB.Model.extend({
    tableName: 'CATEGORY',
    idAttribute: 'CATEGORY_ID'
});

var getCategoryId = function (req, res, next) {
     new Model.Category({CATEGORY_NAME: req.body.category_name})
         .fetch()
         .then(function(model)  {
            return model.get('CATEGORY_ID')
         });
};

module.exports = {
    Category: Category,
    getCategoryId: getCategoryId
};