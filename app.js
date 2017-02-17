var express = require('express')
var path = require('path')
var debug = require('debug')
var logger = require('morgan')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var expressLayouts = require('express-ejs-layouts')
var app = express()
var router = express.Router()
var methodOverride = require('method-override')

// all you need for flash data
var session = require('express-session')
var flash = require('connect-flash')
var cookieParser = require('cookie-parser')

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/animalshelter')

app.use(express.static('public'))

app.use(cookieParser('supercalafragilistic'))
app.use(session({
  secret: 'supercalafragilistic',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}))
app.use(flash())

app.use(methodOverride('_method'))
app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
// app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
// app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')

const Animal = require('./models/animal')
app.get('/', function (req, res) {
  req.flash('flash', {
    type: 'success',
    message: 'Welcome to animal shelter'
  }) // setting the flash data
  res.redirect('/animals')
})
app.get('/animals', function (req, res) {
  Animal.find({}, function (err, output) {
    res.render('animals/index', {
      animals: output,
      flash: req.flash('flash')[0]
    })
  })
})
app.get('/animals/:id', function (req, res, next) {
  if (req.query.status) {
    return next('route')
  }

  Animal.findById(req.params.id, function (err, output) {
    if (err) return next(err)
    res.render('animals/show', {
      animal: output
    })
  })
})
app.get('/animals/:id', function (req, res, next) {
  Animal.findByIdAndUpdate(req.params.id, {
    status: req.query.status
  }, function (err, output) {
    if (err) return next(err)

    res.redirect('/animals')
  })
})
app.post('/animals', function (req, res, next) {
  Animal.create(req.body.animals, function (err, output) {
    if (err) {
      if (err.name === 'ValidationError') {
        let errMessages = []
        for (field in err.errors) {
          errMessages.push(err.errors[field].message)
        }

        console.log(errMessages)

        req.flash('flash', {
          type: 'danger',
          message: errMessages
        })
        res.redirect('/animals')
      }

      return next(err)
    }
    req.flash('flash', {
      type: 'success',
      message: 'Created an animal with name: ' + output.name
    })
    res.redirect('/animals')
  })
})
app.delete('/animals/:id', function (req, res, next) {
  Animal.findByIdAndRemove(req.params.id, function (err, output) {
    if (err) return next(err)
    req.flash('flash', {
      type: 'warning',
      message: 'Deleted an animal'
    })
    res.redirect('/animals')
  })
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    // res.status(err.status || 500)
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // })
  })
}

const port = 4000
app.listen(port, function () {
  console.log('Animal Shelter App is running on ' + port)
})
