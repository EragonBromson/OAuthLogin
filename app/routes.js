var User = require('./models/user');
module.exports = function(app){
  app.get('/', function(request, response){
    response.render('index.ejs');
  });

  app.get('/signup', function(request, response){
    response.render('signup.ejs', {message : 'Victory'});
  });

  app.post('/signup', function(request,response){
    var newUser = new User();
    newUser.local.username = request.body.email; //body parser puts all the forms data in body.
    newUser.local.password = request.body.password;
    // console.log(newUser.local.username + " " + newUser.local.password);
    newUser.save( function(error){
      if(error){
        throw error;
      }
    });
    response.redirect('/');
  });

  app.get('/:username/:password', function(request,response){
    var newUser = new User();
    newUser.local.username = request.params.username;
    newUser.local.password = request.params.password;
    console.log(newUser.local.username + " " + newUser.local.password);
    newUser.save( function(error){
      if(error){
        throw error;
      }
    });
    response.send("Success");
  });
}
