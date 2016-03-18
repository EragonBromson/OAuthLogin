var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String
  }
});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
  //this.local.password is the password stored in db.
}

module.exports = mongoose.model('User', userSchema);
