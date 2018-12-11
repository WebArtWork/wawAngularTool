var Qna = require(__dirname+'/schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/api/qna');
	sd['query_update_all_qna_author'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
	sd['query_unique_field_qna'] = function(req, res){
		return {
			_id: req.body._id,
			author: req.user._id
		};
	};
};
