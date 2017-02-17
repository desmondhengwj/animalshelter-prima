var LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = function (passport) {
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, next) {
    console.log('test')
    // Find user with email as given from the callback
    User.findOne({ 'local.email': email }, function (err, foundUser) {
      // if there's a user with the email
      // call next() middleware with no error arguments + update the flash data

      if (foundUser) {
        console.log('the same user with same email found')
        return next(null, false, req.flash('flash', {
          type: 'warning',
          message: 'This email is already used'
        }))
      }
    })

    // inside the callback,

    // if not found = new user
    // save user to the db as per normal
    // call next() middleware without error argumants
  }))
}
