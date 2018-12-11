module.exports = function(app, sd) {
	var Item = function(req, res){
		res.render('public/Item', sd._ro(req, res, {}));
	}
	app.get('/Item/:id', Item);
	app.get('/Item/:id/en', sd._set_en, Item);
	app.get('/Item/:id/ua', sd._set_ua, Item);
	app.get('/Item/:id/ru', sd._set_ru, Item);

	app.get('*', function(req, res, next){
		if(req.user) next();
		else res.redirect('/Login');
	}, function(req, res){
		res.render('User', sd._ro(req, res, {}));
	});
};