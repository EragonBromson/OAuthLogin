var User = require('./models/user');
var Todo = require('./models/todo');

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
    console.log("His id is: " + request.user._id + "\n");
    response.render('profile.ejs', {user : request.user});
  });


  app.get('/profile/todo_add', isLoggedIn,function(request, response){
    console.log("Add todo called");
    console.log("\n\n");
    // console.log("Form details: \n");
    // // console.log("User Id: " + request.user._id + "\n");
    // console.log("Data: " + request.body.data + "\n");
    // console.log("Date: " + request.body.date + "\n");
    response.render('addTodo.ejs', {message : request.flash('addTodoMessage'), user : request.user });
  });


  app.get('/users', function(request, response){
    User.find({}, function(error,users){
      if(error){
        return next(error);
      }
      response.json(users)
    });
  });

  app.get('/logout', function(request, response){
    request.logout(); //passport function
    response.redirect('/');
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook'
    // , {scope: 'email'}
  ));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/profile');
    });

};

function isLoggedIn(request, response, next) {
  if(request.isAuthenticated()){
    console.log("Authenticated");
    return next();
  }

  response.redirect('/login');
}
