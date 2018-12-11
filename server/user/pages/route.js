module.exports = function(sd) {
	sd._app.get('/Login', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Login.html', {}));
	});
	sd._app.get('/Sign', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Sign.html', {}));
	});
	sd._app.get('/Reset', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Reset.html', {}));
	});
	sd._app.get('/Recover', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Recover.html', {}));
	});
};