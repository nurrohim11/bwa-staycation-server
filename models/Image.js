const mongooses = require('mongoose')

const imageSchema = new mongooses.Schema({
  imageUrl:{
    type:String,
    required: true
  }
})

module.exports = mongooses.model('Image',imageSchema)