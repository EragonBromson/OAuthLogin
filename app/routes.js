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
    response.render('addTodo.ejs', {message : request.flash('addTodoMessage'), user : request.user });
  });

  app.post('/profile/todo_add', function(request,response){
    console.log('Post on add todo called.');
    console.log("Form details: \n");
    console.log("User Id: " + request.user + "\n");
    console.log("Data: " + request.body.data + "\n");
    console.log("Date: " + request.body.date + "  " + request.body.time + "\n");
    // console.log(typeof(request.body.date));
    console.log("todoList: " + typeof(request.user.todoList) + "\n.");
    console.log(request.user.todoList.length);
    if(request.user.todoList.length === 0){
      // request.user.todoList = new Todo();
      var newTodo = new Todo();
      newTodo.data = request.body.data;
      newTodo.date =  new Date(''+request.body.date+' '+request.body.time+':00');
      newTodo.save();

      request.user.todoList.push(newTodo._id);  //todoList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]  List has objects of type ID.

      console.log("newTodo : " + newTodo);
      // request.user.todoList.data = request.body.data;
      // request.user.todoList.date = request.body.date;
      var todo_size = request.user.todoList.length;
      console.log(todo_size + "\n");
      console.log(request.user);
      console.log(request.user.todoList + "\n\n" + request.user.todoList[0].data + "\n\n" + request.user.todoList[0].date);
    } else {
      var newTodo = new Todo();
      newTodo.data = request.body.data;
      newTodo.date =  new Date(''+request.body.date+' '+request.body.time+':00');
      console.log("newTodo : " + newTodo);
      newTodo.save();

      request.user.todoList.push(newTodo._id);
      // console.log(request.user.todoList + "\n\n" + request.user.todoList[3].data + "\n\n" + request.user.todoList[3].date);
      console.log("\n\n After newTodo:  \n" + request.user.todoList);
    }

    request.user.save();
    console.log(request.user.todoList + "\n\n" + request.user.todoList[0].data + "\n\n" + request.user.todoList[0].date);
    response.redirect('/profile');

  });

  app.get('/profile/todo_show', isLoggedIn, function(request, response){
    console.log("Show Todo called.\n\n");
    User.findOne({'_id' : request.user._id})
      .populate('todoList')
      .exec( function(error, userFound){
        if(error){
          return next(error);
        }
        console.log(userFound);
        response.render('showTodo.ejs',{ user : userFound });
        // response.send(users.todoList);
      });
    console.log(request.user.todoList);
    console.log(request.user.todoList);
    // response.redirect('/profile');

  });

  app.get('/profile/todo_delete', isLoggedIn, function(request, response){
    console.log("Delete Todo called.");
    User.findOne({'_id' : request.user._id})
      .populate('todoList')
      .exec( function(error, userFound){
        if(error){
          return next(error);
        }
        console.log(userFound);
        response.render('deleteTodo.ejs',{ user : userFound });
        // response.send(users.todoList);
      });
  });

  app.post('/profile/todo_delete', isLoggedIn, function(request, response){
    console.log("Delete Todo  post called.");
    console.log(request.body.todoListId);
    console.log(request.user.todoList.indexOf(request.body.todoListId));
    var position = request.user.todoList.indexOf(request.body.todoListId);
    request.user.todoList.splice(position,1);
    console.log(request.user.todoList);
    request.user.save();
    response.redirect('/profile');
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
