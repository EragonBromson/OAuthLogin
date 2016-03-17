var User = require('./models/user');
module.exports = function(app, passport){
  app.get('/', function(request, response){
    response.send('Hello.');
  });

  app.get('/login', function(request, response){
    response.render('login.ejs');
  });

  // app.post('/', function(request, response) {
    // var user = new User();
  // });

  app.get('/signup', function(request, response){
    response.render('signup.ejs', {message : request.flash('signupMessage')});
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // app.get('/users', function)

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

}
