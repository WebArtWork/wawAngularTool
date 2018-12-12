module.exports = function(app, sd) {
	app.get('*', function(req, res, next){
		if(req.user) next();
		else res.redirect('/Login');
	}, function(req, res){
		res.render('User', sd._ro(req, res, {}));
	});
};