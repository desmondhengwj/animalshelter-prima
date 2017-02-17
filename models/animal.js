var mongoose = require('mongoose')
var AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Where\'s the name']
  },
  breed: {
    type: String,
    required: [ true, 'Gimme the breed']
  },
  dob: { type: Date, default: Date.now },
  gender: {
    type: String,
    required: [ true, 'What\'s the gender']
  },
  family: String,
  status: {
    type: String,
    enum: ['adopted', 'abandoned'],
    default: 'abandoned'
  }
})

AnimalSchema.virtual('breedFamily').get(function () {
  return this.breed + ' ' + this.family
})

AnimalSchema.virtual('member_since').get(function () {
  return this.dob.getFullYear()
})

var Animal = mongoose.model('Animal', AnimalSchema)

module.exports = Animal
