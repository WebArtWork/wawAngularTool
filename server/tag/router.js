var Tag = require(__dirname+'/schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/api/tag');
	sd['query_update_all_tag_author'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
	sd['query_unique_field_tag'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
};
