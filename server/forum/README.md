# waw Forum part

## part.json
#Field `name`
is used in waw crud to define sd.Forum and other crud options like base for update, get etc.<br>
#Field `dependencies`
is exactly the same dependencies which was in package.json. All those modules which will be definded there, will be installed in root folder into node_modules.<br>
#Field `crud` is configuration for waw crud, define which fields should be updated
#Field `crud.get`
is array with different get requests which can have modified ensure, populate, sort, skip, limit, select and query
#Field `crud.updatesAll`
is array with different updates for many fields, can have ensure and query, with structure of objects = {keys: [], name: ''}
#Field `crud.updates`
is array with different updates for one specific field anywhere in the doc, can have ensure and query, with structure of objects = {keys: [], name: ''}. To use this update you have to specifiy `_id` is the _id of the document, `loc` is the _id of the object where updatable field is placed, `val` is the new value for the field and `place` is the placeholder for the field in the object that the updable field exist. Object which we has the `_id` we provided for `loc` will be searching inside the keys we provide in keys field of part.json.
#Field `crud.unique_field`
is array with different updates for one specific field anywhere in the doc and make sure that the field will be kept unique the in collection, can have ensure and query, with structure of objects = {key: '', name: ''}.
#Field `crud.deletes`
is array with different deletes for documents.

## schema.js
Here we have the collection define for mongodb. If you use waw crud, you should configure here the create method, so crud create work.

## router.js
In this file you start to write your own REST API, which will start with /api/forum.<br>
Waw crud configuration continue here, permision for each update, create, remove and get<br>
Everything what is in commends, code can be uncomment and modified. All those code are like that by default.

## waw crud
##/api/forum/create
sd['ensure_create_forum'] = function(req, res, next){
	if(req.user) next();
	else res.json(false);
};

##/api/forum/get
###Default Get Route Management
sd['ensure_get_forum'] = function(req, res, next){
	next();
};
sd['populate_get_forum'] = function(req, res){
	return false;
};
sd['sort_get_forum'] = function(req, res){
	return false;
};
sd['skip_get_forum'] = function(req, res){
	return false;
};
sd['limit_get_forum'] = function(req, res){
	return false;
};
sd['select_get_forum'] = function(req, res){
	return false;
};
sd['query_get_forum'] = function(req, res){
	return {
		moderators: req.user._id
	}
};
###Custom Get Route Management with name 'all'
sd['ensure_get_forum_all'] = function(req, res, next){
	next();
};
sd['populate_get_forum_all'] = function(req, res){
	return false;
};
sd['sort_get_forum_all'] = function(req, res){
	return false;
};
sd['skip_get_forum_all'] = function(req, res){
	return false;
};
sd['limit_get_forum_all'] = function(req, res){
	return false;
};
sd['select_get_forum_all'] = function(req, res){
	return false;
};
sd['query_get_forum_all'] = function(req, res){
	return {};
};
##/api/forum/update
sd['ensure_update_forum'] = function(req, res, next){
	next();
};
sd['query_update_forum'] = function(req, res){
	return {
		_id: req.body._id,
		moderators: req.user._id
	};
};
##/api/forum/update/all
###Default Update All Route Management
sd['ensure_update_all_forum'] = function(req, res, next){
	next();
};
sd['query_update_all_forum'] = function(req, res){
	return {
		_id: req.body._id,
		moderators: req.user._id
	};
};
###Custom Update All Route Management with name 'all'
sd['ensure_update_all_forum_author'] = function(req, res, next){
	next();
};
sd['query_update_all_forum_author'] = function(req, res){
	return {
		_id: req.body._id,
		moderators: req.user._id
	};
};

##/api/forum/unique/field
sd['ensure_unique_field_forum'] = function(req, res, next){
	next();
};
sd['search_query_unique_field_forum'] = function(req, res, update){
	let query = {};
	query[update.key] = req.body[update.key];
	return query;
};

##/api/forum/delete
sd['ensure_delete_forum'] = function(req, res, next){
	if(req.user) next();
	else res.json(false);
};
sd['delete_forum'] = function(req, res){
	return {
		_id: req.body._id,
		author: req.user._id
	}
}