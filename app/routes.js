var User = require('./models/user');
module.exports = function(app){
  app.get('/', function(request, response){
    response.send("Hello world.");
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
