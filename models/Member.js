const mongooses = require('mongoose')

const memberSchema = new mongooses.Schema({
  firstName:{
    type:String,
    required: true
  },
  lastName:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true
  },
  phoneNumber:{
    type:String,
    required: true
  },
})

module.exports = mongooses.model('Member',memberSchema)