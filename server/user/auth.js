var User = require(__dirname+'/schema.js');
var mongoose = require('mongoose');
var Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha = new Recaptcha('6Lf4nUsUAAAAAMtjSbr2Nfj0iDrc3RSlkEzepIcN', '6Lf4nUsUAAAAANR6Vmkafh82L2Gf08AREuRicHS7');
module.exports = function(sd) {
	/*
	*	Initialize User and Mongoose
	*/
		var router = sd._initRouter('/api/user');
		if(mongoose.connection.readyState==0){
			mongoose.connect(sd._mongoUrl, {
				useNewUrlParser: true
			});
			mongoose.set('useCreateIndex', true);
			mongoose.Promise = global.Promise;
		}
		sd._passport.serializeUser(function(user, done) {
			done(null, user.id);
		});
		sd._passport.deserializeUser(function(id, done) {
			User.findById(id, function(err, user) {
				done(err, user);
			});
		});
		router.get("/me", sd._ensure, function(req, res) {
			var json = {};
			if(req.user){
				sd.User.schema.eachPath(function(path) {
					path = path.split('.')[0];
					if(path=='password'||path=='__v'||json[path]) return;
					json[path] = req.user[path];
				});
			}
			res.json(json);
		});
		router.post('/status', function(req, res) {
            User.findOne({
                $or: [{
                    reg_email: req.body.email.toLowerCase()
                },{
                    email: req.body.email.toLowerCase()
                }]
            }, function(err, user) {
                var json = {};
                json.email = !!user;
                if(user&&req.body.password){
                    json.pass = user.validPassword(req.body.password);
                }
                res.json(json);
            });
        });
		router.post("/changePassword", sd._ensure, function(req, res) {
			if (req.user.validPassword(req.body.oldPass)){
				req.user.password = req.user.generateHash(req.body.newPass);
				req.user.save(function(){
					res.json(true);
				});
			}else res.json(false);
		});
		router.post("/admin/changePassword", sd.ensure_super, function(req, res) {
			User.findOne({_id: req.body._id}, function(err, user){
				user.password = user.generateHash(req.body.newPass);
				user.save(function(){
					res.json(true);
				});
			});
		});
		router.get('/logout', function(req, res) {
			req.logout();
			res.redirect(sd._config.passport.local.successRedirect);
		});
	/*
	*	Set "is" on users
	*/
		var unique = {};
		var set = function(email, which){
			if(unique[email]){
				return setTimeout(function(){
					set(email, which);
				}, 500);
			}
			unique[email] = true;
			User.findOne({
				email: email
			}, function(err, user){
				if(user){
					if(!user.is) user.is={};
					user.is[which ] = true;
					user.markModified('is');
					user.save(function(){
						unique[email] = false;
					});
				}else{
					unique[email] = false;
				}
			});
		}
		if(typeof sd._config.is == 'object'){
			for(var key in sd._config.is){
				if(Array.isArray(sd._config.is[key])){
					for (var i = 0; i < sd._config.is[key].length; i++) {
						set(sd._config.is[key][i], key);
					}
				}
			}
		}
	// Local Routing
		if(sd._config.passport.local){
			var LocalStrategy = require('passport-local').Strategy;
			router.post('/login', sd._passport.authenticate('local-login', {
				successRedirect: sd._config.passport.local.successRedirect,
				failureRedirect: sd._config.passport.local.failureRedirect
			}));
			sd._passport.use('local-login', new LocalStrategy({
				usernameField : 'username',
				passwordField : 'password',
				passReqToCallback : true
			}, function(req, username, password, done) {
				User.findOne({
					'email' :  username.toLowerCase()
				}, function(err, user) {
					if (err) return done(err);
					if (!user) return done(null, false);
					if (!user.validPassword(password)) return done(null, false);
					return done(null, user);
				});
			}));
			router.post('/signup', sd._passport.authenticate('local-signup', {
				successRedirect: sd._config.passport.local.successRedirect,
				failureRedirect: sd._config.passport.local.failureRedirect
			}));
			sd._passport.use('local-signup', new LocalStrategy({
				usernameField : 'username',
				passwordField : 'password',
				passReqToCallback : true
			}, function(req, username, password, done) {
				//recaptcha.verify(req, function(error) {
					User.findOne({
						'email': username.toLowerCase()
					}, function(err, user) {
						if (err) return done(err);
						if (user) return done(null, false);
						else {
							var newUser = new User();
							newUser.is = {
								admin: false
							};
							newUser.name = req.body.name;
							newUser.email = username.toLowerCase();
							newUser.password = newUser.generateHash(password);
							newUser.save(function(err) {
								if (err) throw err;
								return done(null, newUser);
							});
						}
					});
				//});
			}));
		}
	// Google
		if (sd._config.passport.google) {
			var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
			router.get('/google', sd._passport.authenticate('google', {
				scope: ['profile', 'email']
			}));
			router.get('/google/callback', sd._passport.authenticate('google', {
				successRedirect: '/',
				failureRedirect: '/'
			}));
			sd._passport.use('google', new GoogleStrategy({
				clientID: sd._config.passport.google.clientID,
				clientSecret: sd._config.passport.google.clientSecret,
				callbackURL: sd._config.passport.google.callbackURL,
				passReqToCallback: true
			}, function(req, token, refreshToken, profile, done) {
				User.findOne({
					_id: req.user._id
				}, function(err, user) {
					if (err) return done(err);
					if (user) {
						var google = {};
						google.id = profile.id;
						google.url = profile._json.url;
						req.user.saveGoogle(google, function() {});
						return done(null, user);
					}
				});
			}));
		}
	// Instagram
		if(sd._config.passport.instagram){
			var InstagramStrategy= require('passport-instagram').Strategy;
			router.get('/instagram',
				sd._passport.authenticate('instagram')
			);
			router.get('/instagram/callback', sd._passport.authenticate('instagram', {
				failureRedirect: '/login'
			}), function(req, res) {
				res.redirect('/');
			});
			sd._passport.use('instagram',new InstagramStrategy({
				clientID : sd._config.passport.instagram.clientID,
				clientSecret : sd._config.passport.instagram.clientSecret,
				callbackURL : sd._config.passport.instagram.callbackURL,
				passReqToCallback:true
			}, function (req, accessToken, refreshToken, profile, done) {
				User.findOne({
					_id: req.user._id
				}, function(err, user) {
					if (err) return done(err);
					if (user) {
						var instagram = {};
						instagram.id = profile.id;
						instagram.username = profile.username;
						req.user.saveInstagram(instagram, function() {});
						return done(null, user);
					}
				});
			}));
		}
	// Facebook
		if(sd._config.passport.facebook){
			var FacebookStrategy = require('passport-facebook').Strategy;
			router.get('/facebook', sd._passport.authenticate('facebook', {
				display: 'page',
				scope: 'email'
			}));
			router.get('/facebook/callback', sd._passport.authenticate('facebook', {
				failureRedirect: '/login'
			}), function(req, res) {
				res.redirect('/');
			});
			sd._passport.use('facebook',new FacebookStrategy({
				clientID: sd._config.passport.facebook.clientID,
				clientSecret: sd._config.passport.facebook.clientSecret,
				callbackURL: sd._config.passport.facebook.callbackURL,
				profileFields: ['id', 'profileUrl'],
				passReqToCallback:true
			}, function (req,token, refreshToken, profile, done) {
				console.log(profile);
				User.findOne({
					 _id:req.user._id
				 },
				  function (err, user) {
					if (err)return done(err);
					if (user) {
						var facebook={};
						facebook.profileUrl=profile.profileUrl;
						facebook.id=profile.id;
						req.user.saveFacebook(facebook,function(){
						});
						return done(null, user);
					}
				});
			}));
		}
	// Twitter
		if(sd._config.passport.twitter){
			var TwitterStrategy = require('passport-twitter').Strategy;
			sd._passport.use(new TwitterStrategy({
				consumerKey: sd._config.passport.twitter.consumerKey,
				consumerSecret: sd._config.passport.twitter.consumerSecret,
				callbackURL: sd._config.passport.twitter.callbackURL
			},function(token, tokenSecret, profile, done) {
				process.nextTick(function() {
					User.findOne({
						'twitter.id': profile.id
					}, function(err, user) {
						if (err) return done(err);
						else if (user) return done(null, user);
						else {
							var newUser = new User();
							newUser.twitter = {
								displayName : profile.displayName,
								username : profile.username,
								id : profile.id,
								token : token,
							}
							newUser.save(function(err) {
								console.log(newUser);
								if (err) throw err;
								return done(null, newUser);
							});
						}
					});
				});
			}));
			router.get('/twitter', sd._passport.authenticate('twitter'));
			router.get('/twitter/callback', sd._passport.authenticate('twitter', {
				successRedirect: sd._config.passport.twitter.successRedirect,
				failureRedirect: sd._config.passport.twitter.failureRedirect
			}),function(req, res) {
				res.redirect(sd._config.passport.twitter.successRedirect);
			});
		}
	// End of Crud
};