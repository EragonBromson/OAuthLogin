var User = require('./models/user');
module.exports = function(app, passport){
  app.get('/', function(request, response){
    response.render('index.ejs');
  });

  app.get('/login', function(request, response){
    response.render('login.ejs', {message : request.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('local-login', {
  		successRedirect: '/profile',
  		failureRedirect: '/login',
  		failureFlash: true
  	}));

  app.get('/signup', function(request, response){
    response.render('signup.ejs', {message : request.flash('signupMessage')});
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/profile', isLoggedIn, function(request,response){
    console.log("Profile page called: " + request.user);
    response.render('profile.ejs', {user : request.user});
  });

  app.get('/users', function(request, response){
    User.find({}, function(error,users){
      if(error){
        return next(error);
      }
      response.json(users)
    });
  });

  // app.post('/signup', function(request,response){
  //   var newUser = new User();
  //   newUser.local.username = request.body.username; //body parser puts all the forms data in body.
  //   newUser.local.password = request.body.password;
  //   // console.log(newUser.local.username + " " + newUser.local.password);
  //   newUser.save( function(error){
  //     if(error){
  //       throw error;
  //     }
  //   });
  //   response.redirect('/');
  // });

};

function isLoggedIn(request, response, next) {
  if(request.isAuthenticated()){
    console.log("Authenticated");
    return next();
  }

  response.redirect('/login');
}
