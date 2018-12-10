var Project = require(__dirname+'/schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/api/project');
	sd['query_update_all_project_author'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
	sd['query_unique_field_project'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
};
