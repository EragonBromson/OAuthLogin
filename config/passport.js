
var LocalStrstergy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(error, user){
      done(error, user);
    });

    passport.use('local-signup', new LocalStrstergy({
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
            newUser.local.password = password;
            newUser.save(function(error){
              if(error){
                throw error;
                return done(null, newUser);
              }
            })
          }
        })
      });
    }

  ));

  });
}
