const mongooses = require('mongoose')

const bankSchema = new mongooses.Schema({
  nameBank:{
    type:String,
    required: true
  },
  nomorRekening:{
    type:String,
    required: true
  },
  name:{
    type:String,
    required: true
  },
  imageUrl:{
    type:String,
    required:true
  }
})

module.exports = mongooses.model('Bank',bankSchema)