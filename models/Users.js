const mongooses = require('mongoose')
const bycript = require('bcryptjs')

const userSchema = new mongooses.Schema({
  username:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required: true
  },
})

userSchema.pre('save',async function(next){
  const user = this
  if(user.isModified('password')){
    user.password = await bycript.hash(user.password,8)
  }
})

module.exports = mongooses.model('Users',userSchema)