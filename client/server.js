module.exports = function(app, sd) {
	var Item = function(req, res){
		res.render('public/Item', sd._ro(req, res, {}));
	}
	app.get('/Item/:id', Item);
	app.get('/Item/:id/en', sd._set_en, Item);
	app.get('/Item/:id/ua', sd._set_ua, Item);
	app.get('/Item/:id/ru', sd._set_ru, Item);

	var User = function(req, res){
		console.log('we are here');
		res.render('User', sd._ro(req, res, {}));
	}
	app.get('*', sd._ensure, User);
};