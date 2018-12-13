var app = angular.module('ngapp',['ui.router', 'wcom']);
app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/AllItems');
	$stateProvider.state({
		name: 'NewProject',
		url: '/Project', controller: function($scope, Project){
			$scope.p = Project;
			Project.project = {};
		}, templateUrl: '/html/user/Project.html'
	}).state({
		name: 'Project',
		url: '/Project/:project_id', controller: function($scope, Project, mongo){
			$scope.p = Project;
			mongo.on('project', Project.set);
		}, templateUrl: '/html/user/Project.html'
	}).state({
		name: 'Projects',
		url: '/Projects', controller: function($scope, Project, $state){
			$scope.p = Project;
		}, templateUrl: '/html/user/Projects.html'
	}).state({
		name: 'NewItem',
		url: '/Item', controller: function($scope, Item){
			$scope.i = Item;
			Item.create();
		},
		templateUrl: '/html/user/Item.html'
	}).state({
		name: 'Item',
		url: '/Item/:item_id', controller: function($scope, Item, mongo){
			$scope.i = Item;
			mongo.on('item', Item.set);
		},
		templateUrl: '/html/user/Item.html'
	}).state({
		name: 'Items',
		url: '/Items', controller: function($scope, Item, User){
			$scope.u = User;
			$scope.i = Item;
			$scope.items = Item.mine;
		},
		templateUrl: '/html/user/Items.html'
	}).state({
		name: 'AllItems',
		url: '/', controller: function($scope, Item, User){
			$scope.u = User;
			$scope.i = Item;
			$scope.items = Item.items;
		},
		templateUrl: '/html/user/Items.html'
	}).state({
		name: 'ProjectItems',
		url: '/Items/:items_project_id', controller: function($scope, Item, User, Project, mongo){
			$scope.u = User;
			$scope.i = Item;
			$scope.p = Project;
			mongo.on('project item', function(){
				Project.set(function(){
					$scope.items = [];
					if(Project.project.items){
						for (var i = 0; i < Project.project.items.length; i++) {
							if(Item._items[Project.project.items[i]]){
								$scope.items.push(Item._items[Project.project.items[i]]);
							}
						}
					}
				});
			});
		},
		templateUrl: '/html/user/Items.html'
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
services.Project = function(mongo, $state){
	var self = this;
	this.set = function(cb){
		for (var i = 0; i < self.projects.length; i++) {
			if(self.projects[i]._id == $state.params.project_id||
				self.projects[i]._id == $state.params.items_project_id){
				self.project=self.projects[i];
				return typeof cb == 'function'&&cb();;
			}
		}
		$state.go('Projects');
	}
	self.projects = mongo.get('project');
	this.create = function(doc){
		mongo.create('project', doc, function(){
			$state.go('Projects');
		});
	}
	this.update = function(doc){
		if(!doc||!doc._id) return self.create(doc||{});
		mongo.updateAll('project', doc);
	}
	this.delete = function(doc){
		mongo.delete('project', {
			_id: doc._id
		});
	}

}
services.Item = function(mongo, $state, User, Project, modal){
	var self = this;
	this.state = $state.current;
	this.set = function(){
		for (var i = 0; i < self.items.length; i++) {
			if(self.items[i]._id == $state.params.item_id){
				return self.item=self.items[i];
			}
		}
		$state.go('Items');
	}
	// replace this with mongo.on
	this.init = function(){
		if(!User._id){
			return setTimeout(self.init, 500);
		}
		self.items = mongo.get('item', {
			group: 'project',
			query: {
				mine: function(doc){
					return doc.author == User._id;
				}
			}
		}, function(arr, obj){
			self._items = obj;
			self.mine = obj.mine;
			$state.reload();
		});
	}
	this.init();

	this.create = function(doc){
		mongo.create('item', doc||{}, function(created){
			$state.go('Item', {
				item_id: created._id
			});
		});
	}
	this.update = function(doc){
		mongo.afterWhile(doc, function(){
			mongo.updateAll('item', doc);
		});
	}
	this.delete = function(doc){
		mongo.delete('item', {
			_id: doc._id
		});
	}
	this.add = function(item){
		modal.open({
			templateUrl: '/html/modals/addItemToProject.html',
			item: item,
			p: Project,
			i: self
		});
	}
}
services.Tag = function(mongo){
	var self = this;
	this.projects = mongo.get('tag');
	this.create = function(doc){
		mongo.create('tag', doc);
	}
	this.update = function(doc){
		mongo.updateAll('tag', doc);
	}
	this.delete = function(doc){
		mongo.delete('tag', {
			_id: doc
		});
	}
}