var Item = require(__dirname+'/schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/api/item');
	sd['query_update_all_item_author'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
	sd['query_unique_field_item'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
};
