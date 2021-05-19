const mongooses = require('mongoose')
const {ObjectId} = mongooses.Schema

const itemSchema = new mongooses.Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  country:{
    type:String,
    default:'Indonesia',
    required:true
  },
  city:{
    type:String,
    required:true
  },
  isPopular:{
    type:Boolean
  },
  description:{
    type:String,
    required:true
  },
  unit:{
    type:String,
    default:'night'
  },
  sumBooking:{
    type:Number,
    default:0
  },
  categoryId:{
    type:ObjectId,
    ref:'Category'
  },
  imageId:[{
    type:ObjectId,
    ref:'Image'
  }],
  featureId:[{
    type:ObjectId,
    ref:'Feature'
  }],
  activityId:[{
    type:ObjectId,
    ref:'Activity'
  }]
})

module.exports = mongooses.model('Item',itemSchema)