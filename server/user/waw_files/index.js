var User = require(__dirname+'/../schema.js');
module.exports = function(sd) {
	var router = sd._initRouter('/waw/file');
	sd.file = {
		add: function(){
			// add new file
		},
		list: function(){
			// list all files
		},
		move: function(){
			// move an image within the server
		},
		remove: function(){
			// delete an file
		}
	}
	router.get("/list", function(req, res) {
		// get you list of all files
	});
	router.post("/add", function(req, res) {
		// add new file
	});
	router.post("/delete", function(req, res) {
		// add new file
	});
	/*
	*	CMS
	*/
	router.get("/", function(req, res) {
		res.sendFile(__dirname+'/client.html');
	});
};