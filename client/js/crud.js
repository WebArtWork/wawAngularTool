var app = angular.module('ngapp',['ui.router', 'wcom']);
app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
	var ctrl = function($scope, User, Project, Tag, Item){
		$scope.u = User;
		$scope.p = Project;
		$scope.t = Tag;
		$scope.i = Item;
	}
	$urlRouterProvider.otherwise('/AllItems');
	$stateProvider.state({
		name: 'NewProject',
		url: '/NewProject', controller: ctrl,
		templateUrl: '/html/user/NewProject.html'
	}).state({
		name: 'MyProjects',
		url: '/MyProjects', controller: ctrl,
		templateUrl: '/html/user/MyProjects.html'
	}).state({
		name: 'NewItem',
		url: '/NewItem', controller: ctrl,
		templateUrl: '/html/user/NewItem.html'
	}).state({
		name: 'MyItems',
		url: '/MyItems', controller: ctrl,
		templateUrl: '/html/user/MyItems.html'
	}).state({
		name: 'AllItems',
		url: '/AllItems', controller: ctrl,
		templateUrl: '/html/user/AllItems.html'
	}).state({
		name: 'ProjectItems',
		url: '/ProjectItems', controller: ctrl,
		templateUrl: '/html/user/ProjectItems.html'
	});
	$locationProvider.html5Mode(true);
});
var services = {}, filters = {}, directives = {}, controllers = {};
app.service(services).filter(filters).directive(directives).controller(controllers);

services.User = function($http, $timeout, mongo){
	var self = this;
	$http.get('/api/user/me').then(function(resp){
		for(let key in resp.data){
			self[key] = resp.data[key];
		}
		self.users = mongo.get('user');
	});
	this.update = function(){}
}
services.Project = function(mongo){
	self.projects = mongo.get('project');
	this.create = function(doc){
		mongo.create('project', doc);
	}
	this.update = function(doc){
		mongo.updateAll('project', doc);
	}
	this.delete = function(doc){
		this.delete('project', {
			_id: doc
		});
	}
}
services.Tag = function(mongo){
	self.projects = mongo.get('tag');
	this.create = function(doc){
		mongo.create('tag', doc);
	}
	this.update = function(doc){
		mongo.updateAll('tag', doc);
	}
	this.delete = function(doc){
		this.delete('tag', {
			_id: doc
		});
	}
}
services.Item = function(mongo){
	self.projects = mongo.get('item');
	this.create = function(doc){
		mongo.create('item', doc);
	}
	this.update = function(doc){
		mongo.updateAll('item', doc);
	}
	this.delete = function(doc){
		this.delete('item', {
			_id: doc
		});
	}
}