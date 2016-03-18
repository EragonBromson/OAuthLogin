var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

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


  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields : configAuth.facebookAuth.profileFields
    },
    function(accessToken, refreshToken, profile, cb) {
      process.nextTick(function(){
        //All that returns from fb is in profile
        User.findOne({'facebook.id' : profile.id}, function(error,user){
          if(error)
            return cb(error);
          if(user)
            return cb(null,user);
          else{
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            // newUser.facebook.email = null || profile.emails[0].value;

            newUser.save(function(error){
              if(error){
                throw error;
              }
              return cb(null, newUser);
            });
          }
        });
      });
    }
  ));

}
