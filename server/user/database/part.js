var XLSX = require('xlsx');
var part = require('./list');

module.exports = function(sd, part) {
	var router = sd._initRouter('/waw/db/'+ part);
	var Schema = require(process.cwd()+'/server/'+part+'/schema.js');
	var allow = function(req, res, next){
		if(req.user && req.user.is && (req.user.is.dbsuper || req.user.is.dbadmin || req.user.is['dbp'+part]) ){
			next();
		}else res.json(false);
	}
	router.get("/", allow, function(req, res) {
		res.sendFile(__dirname+'/part.html');
	});
	router.get("/get", allow, function(req, res) {
		var json = {
			fields: []
		}
		var unique = {};
		Schema.schema.eachPath(function(path, type) {
			/*
			*	need to fix to have all subpath
			*/
			type = type.instance;
			path = path.split('.')[0];
			if(path == '__v' || unique[path]) return;
			unique[path] = true;
			if(type == 'ObjectID') type = 'String';
			if(type == 'Array') type = 'Mixed';
			json.fields.push({
				type: type,
				path: path
			});
		});
		Schema.find({}, function(err, docs){
			json.docs = docs;
			res.json(json);
		});
	});
	router.post("/update", allow, function(req, res) {
		Schema.findOne({
			_id: req.body._id
		}, function(err, doc){
			var unique = {};
			Schema.schema.eachPath(function(path) {
				path = path.split('.')[0];
				if(path == '__v' || path == '_id' || unique[path]) return;
				unique[path] = true;
				doc[path] = req.body[path];
			});
			doc.save(function() {
				res.json(true);
			});
		});
	});
	router.get("/create", allow, function(req, res) {
		new Schema().save().then(created=>{
			res.json(created);
		});
	});
	router.get("/wipe", allow, function(req, res) {
		User.remove({}, function(){
			res.json(true);
		});
 	});
	router.get("/"+part+".xlsx", allow, function(req, res) {
		var fields = [];
		Schema.schema.eachPath(function(path) {
			fields.push(path);
		});
		Schema.find({}).lean().exec(function(err, docs){
			for (var i = docs.length - 1; i >= 0; i--) {
			 	docs[i]._id = docs[i]._id.toString(); 
			 	for (var j = fields.length - 1; j >= 0; j--) {
			 		if(typeof docs[i][fields[j]] == 'object') {
			 		 	docs[i][fields[j]] = JSON.stringify(docs[i][fields[j]]);
			 		} else if (typeof docs[i][fields[j]] == 'array') {
			 			docs[i][fields[j]] = JSON.stringify(docs[i][fields[j]]);
			 		}
			 	}
			}
			var ws = XLSX.utils.json_to_sheet(docs);
			var wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Schema");
			res.status(200).send(XLSX.write(wb, {
				type: 'buffer',
				bookType: "xlsx"
			}));
		});
	});
	router.post("/import", allow, function(req, res) {
		var counter = req.body.length;
		for (var i = 0; i < req.body.length; i++) {
			new Schema(req.body[i]).save().then(created=>{
				if(--counter==0) res.json(true);
			});
		}
	});
}