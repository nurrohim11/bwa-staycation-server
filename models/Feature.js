const mongooses = require('mongoose')
const { ObjectId } = mongooses.Schema

const featureSchema = new mongooses.Schema({
  name:{
    type:String,
    required: true
  },
  qty:{
    type:Number,
    required: true
  },
  imageUrl:{
    type:String,
    required: true
  },
  itemId:[{
    type:ObjectId,
    ref:'Item'
  }]
})

module.exports = mongooses.model('Feature',featureSchema)