const mongooses = require('mongoose')
const { ObjectId } = mongooses.Schema

const categorySchema = new mongooses.Schema({
  name:{
    type:String,
    required: true
  },
  itemId:[{
    type:ObjectId,
    ref:'Item'
  }]
})

module.exports = mongooses.model('Category',categorySchema)