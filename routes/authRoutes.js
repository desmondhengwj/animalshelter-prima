var express = require('express')
var router = express.Router()
var passport = require('passport')

router.get('/signup', function (req, res) {
  res.render('auth/signup', {
    flash: req.flash('flash')[0]
  }) // render the form
})

router.post('/signup', function (req, res) {
  var signupStrategy = passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: false
  })

  return signupStrategy(req, res)
})

router.get('/login', function (req, res) {
  res.render('auth/login')
})

router.post('/login', function (req, res) {
  res.send('post login')
})

module.exports = router
