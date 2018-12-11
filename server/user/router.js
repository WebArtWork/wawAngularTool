var User = require(__dirname+'/schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/api/user');
	let ensure_admin = sd.ensure_admin = function(req, res, next){
		if(req.user&&req.user.is&&req.user.is.admin) next();
		else res.send(false);
	};
	let ensure_super = sd.ensure_super = function(req, res, next){
		if(req.user&&req.user.is&&req.user.is.super_admin) next();
		else res.send(false);
	};
	/*
	*	waw crud : Get Configuration
	*/
		sd['query_get_user'] = function(){return {}};
		sd['select_get_user'] = function(){return 'avatarUrl data name email friends'};

		sd['ensure_get_user_admin'] = ensure_admin;
		sd['query_get_user_admin'] = function(){return {}};
		sd['select_get_user_admin'] = function(){return '-password'};
	/*
	*	waw crud : Update Configuration
	*/
		sd['ensure_update_all_user_super'] = ensure_super;
		sd['query_update_all_user_super'] = function(req, res, next) {
			return {
				_id: req.body._id
			}
		};
		sd['ensure_update_all_user_admin'] = ensure_admin;
		sd['query_update_all_user_admin'] = function(req, res, next) {
			return {
				_id: req.body._id
			}
		};
		sd['query_update_all_user'] = function(req, res, next) {
			return {
				_id: req.user._id
			}
		};
	/*
	*	waw crud : Delete Configuration
	*/
		sd['ensure_delete_user_admin'] = ensure_admin;
		sd['query_delete_user_admin'] = function(req, res, next){
			return {
				_id: req.body._id
			}
		};
		sd['query_delete_user'] = function(req, res, next){
			return {
				_id: req.user._id
			}
		};
		sd['files_to_remove_delete_user'] = function(req, res, next){
			return __dirname+'/files/'+req.user._id;
		};
	/*
	*	Custom Routes Management
	*/
	/*
	*	Avatar Management
	*/
	router.post("/file", function(req, res) {
			console.log(req.body.dataUrl.length);
			req.user.avatarUrl = '/api/user/avatar/' + req.user._id + '.jpg?' + Date.now();
			sd._parallel([function(n){
				req.user.save(n);
			}, function(n){
				sd._dataUrlToLocation(req.body.dataUrl,
					__dirname + '/files/', req.user._id + '.jpg', n);
			}], function(){
				console.log(req.user.avatarUrl);
				res.json(req.user.avatarUrl);
			});
		});
		router.get("/avatar/:file", function(req, res) {
			res.sendFile(__dirname + '/files/' + req.params.file);
		});
		router.get("/default.png", function(req, res) {
			res.sendFile(__dirname + '/files/avatar.png');
		});
		router.get("/default.jpg", function(req, res) {
			res.sendFile(__dirname + '/files/avatar.png');
		});
	// End of
};