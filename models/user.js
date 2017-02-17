var mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String
  }
})

var User = mongoose.model('User', UserSchema)

module.exports = User
