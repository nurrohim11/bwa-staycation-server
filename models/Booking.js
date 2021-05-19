const mongooses = require('mongoose')
const {ObjectId} = mongooses.Schema

const bookingSchema = new mongooses.Schema({
  bookingStartDate:{
    type:Date,
    required: true
  },
  bookingEndDate:{
    type:Date,
    required: true
  },
  invoice:{
    type:String,
    required: true
  },
  itemId:{
    _id:{
      type:ObjectId,
      ref:'Item',
      required:true
    },
    title:{
      type:String,
      rquired:true
    },
    price:{
      type:Number,
      rquired:true
    },
    duration:{
      type:Number,
      rquired:true
    }
  },
  total:{
    type:Number,
    rquired:true
  },
  memberId:{
    type:ObjectId,
    ref:'Member'
  },
  bankId:{
    type:ObjectId,
    ref:'Bank'
  },
  payments:{
    proofPayment:{
      type:String,
      required:true
    },
    bankFrom:{
      type:String,
      required:true
    },
    accountHolder:{
      type:String,
      required:true
    },
    status:{
      type:String,
      default:'Proses'
    }
  }
})

module.exports = mongooses.model('Booking',bookingSchema)