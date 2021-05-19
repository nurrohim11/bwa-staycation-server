const mongooses = require('mongoose')
const { ObjectId } = mongooses.Schema

const activitySchema = new mongooses.Schema({
  name:{
    type:String,
    required: true
  },
  type:{
    type:String,
    required: true
  },
  imageUrl:{
    type:String,
    required: true
  },
  isPopular:{
    type:Boolean
  },
  itemId:[{
    type:ObjectId,
    ref:'Item'
  }]
})

module.exports = mongooses.model('Activity',activitySchema)