var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(error, user){
      done(error, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true
  },
  function(request, username, password, done){
    process.nextTick(function(){
      User.findOne({'local.username' : username},function(error, user){
        if(error){
          return done(error);
        }
        if(user){
          return done(null, false, request.flash('signupMessage', 'Username already exists'));
        }
        else{
          var newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(error){
            if(error)
              throw error;
            return done(null, newUser);
          })
        }
      })
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(request, username, password, done){
    process.nextTick(function(){
      User.findOne({'local.username': username}, function(error, user){
        if(error){
          return done(error);
        }
        // console.log(user.local.username);
        // console.log(user.local.password);
        if(!user){
          return done(null, false, request.flash('loginMessage', 'Username does not exist.'));
        }
        // console.log(password);
        if(user.validPassword(user.local.password)){
            return done(null, false, request.flash('loginMessage', 'Password incorrect'));
        }
        return done(null, user);
      });
    });
  }));

}
