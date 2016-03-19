var mongoose = require('mongoose');
var User = require('./user');


var todoSchema = mongoose.Schema({
  data : String,
  date : Date,
  user :  { type: Number, ref: 'User' }
})

module.exports = mongoose.model('Todo', todoSchema);
