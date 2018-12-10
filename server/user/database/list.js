var User = require(process.cwd()+'/server/user/schema.js');
var XLSX = require('xlsx');


// console.log(Object.keys(User.schema.paths));
// var fields = [];
// var each = function(schema, _fields){
// 	schema.eachPath(function(path, type) {
// 		if(type.instance=='Array'){
// 			if(typeof type.caster.schema == 'object'){
// 				var arr = {
// 					name: path,
// 					path: path,
// 					arr: true,
// 					fields: []
// 				}
// 				_fields.push(arr);
// 				each(type.caster.schema, arr.fields);
// 			}else{
// 				_fields.push({
// 					name: path,
// 					path: path,
// 					arr: true,
// 				});
// 			}
// 		}else{
// 			_fields.push({
// 				name: path,
// 				path: path
// 			});
// 		}
// 	});
// }
// each(User.schema, fields);
// console.log(fields);



module.exports = function(sd, part) {
	var router = sd._initRouter('/waw/db');
	var collections = [], schemas = [], _schema = {};
	var allow = function(req, res, next){
		if(req.user && req.user.is && (req.user.is.dbsuper || req.user.is.dbadmin) ){
			next();
		}else res.json(false);
	}
	for (var i = 0; i < sd._parts.length; i++) {
		if (process.cwd()+'/server/'+sd._parts[i].name+'/schema.js'){
			collections.push(sd._parts[i].name);
			var schema = require(process.cwd()+'/server/'+sd._parts[i].name+'/schema.js');
			_schema[sd._parts[i].name] = schema;
			schemas.push(schema);
			require(__dirname + '/part.js')(sd, sd._parts[i].name);
		}
	}
	router.get("/", allow, function(req, res) {
		res.sendFile(__dirname + '/list.html');
	});
	router.get("/get", allow, function(req, res) {
		if(req.user.is.dbsuper){
			User.find({}, function(err, users){
				res.json({
					collections: collections,
					super: true,
					users: users
				});
			});
		}else{
			res.json({
				collections: collections
			});
		}
	});
	router.post("/import", allow, function(req, res) {
		var counter = 0;
		for (var i = 0; i < req.body.length; i++) {
			if(_schema[req.body[i].name]){
				for (var j = 0; j < req.body[i].docs.length; j++) {
					counter++;
					new _schema[req.body[i].name](req.body[i].docs[j]).save().then(created=>{
						if(--counter==0) res.json(true);
					});
				}
			}
		}
	});
	var each = function(schema, arr, book){
		arr.push(function(next){
			schema.find({}).lean().exec(function(err, parts){
				//var ws = XLSX.utils.json_to_sheet(sd._parts);
				//XLSX.utils.book_append_sheet(book, ws, "Parts");
				next();
			});
		});
	}
	router.get("/database.xlsx", allow, function(req, res) {
		var arr = [];
		var book = XLSX.utils.book_new();
		for (var i = 0; i < schemas.length; i++) {
			each(schemas[i], arr, book);
		}
		sd._parallel(arr, function(){
			res.status(200).send(XLSX.write(book, {
				type: 'buffer',
				bookType: "xlsx"
			}));
		});
	});
};