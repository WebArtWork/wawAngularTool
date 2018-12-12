module.exports = function(sd) {
	sd._app.get('/Login', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Login.html', {
			title: sd._config.name+' | Login',
			description: 'To log in to your profile and use all WebArt.Work tools, you need to enter the email and password that you used when registering your account.',
			image: '',
			keywords: 'WebArt.Work, Web, Art, Work, log in, Login, your profile, profile, WebArt.Work tools, tools, user needs to enter an email and password, user, email, password, email and password, registering his account, registering'
		}));
	});
	sd._app.get('/Sign', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Sign.html', {
			title: sd._config.name+' | Sign up',
			description: 'Registration on the site is an action aimed at creating a personal account on a web-resource in order to gain access to its full functionality. On the WebArt.Work website, registration is required so that you can freely use all of the WebArt.Work tools. To do this, enter your email and password in the Sign Up section.',
			image: '',
			keywords: 'WebArt.Work, Web, Art, Work, Sign up, Register, Registration on the site, Registration, creating a personal account, creating, personal account, account, web-resource, in order to gain access to its full functionality, order, gain access, full functionality, functionality, WebArt.Work website, website, user, use, WebArt.Work tools, tools, enter your email and password, email and password, email, password, Sign Up modal window, Sign Up, modal window'
		}));
	});
	sd._app.get('/Reset', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Reset.html', {
			title: sd._config.name+' | Reset',
			description: 'If you forget your password, you can reset it. To do this, open a password reset, enter your email and name. An email will be sent to reset the password. You need to click on the link that is specified in the letter and enter a new password.',
			image: '',
			keywords: 'WebArt.Work, Web, Art, Work, Reset, user, forgotten the password, password, reset, sending a link, link, create, new password, restore access to the account, restore access, access, account, modal window, password reset, email, username. follow the link, letter, enter a new password.'
		}));
	});
	sd._app.get('/Recover', function(req, res){
		res.send(sd._derer.renderFile(__dirname+'/Recover.html', {
			title: sd._config.name+' | Recover',
			description: 'In order to change the password you need to enter your old password in the recovery section, as well as enter the new password and confirm your action. After changing the password, you will need to re-enter WebArt.Work on all devices on which you use it.',
			image: '',
			keywords: 'WebArt.Work, Web, Art, Work, Recover, order to change the password, change the password, password, user, enter his old password, old password, modal recovery window, enter the new password, new password, confirm its action, action, changing the password, devices'
		}));
	});
};