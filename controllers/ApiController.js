const Item = require('../models/Item')
const Treveler = require('../models/Booking')
const Treasure = require('../models/Activity')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Member = require('../models/Member')
const Booking = require('../models/Booking')

module.exports ={
  landingPage:async(req, res)=>{
    try{
      const mostPicked = await Item.find()
        .select('_id title country city price unit imageId')
        .limit(5)
        .populate({path:'imageId',select:'_id imageUri'})

      const category = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path:'itemId',
          select:'_id title country city isPopular imageId',
          perDocumentLimit:4,
          option: {sort : { sumBooking:-1 }},
          populate:{
            path:'imageId',
            select:'id imageUrl',
            perDocumentLimit:1
          },
        })

      const treveler = await Treveler.find()
      const treasure = await Treasure.find()
      const city = await Item.find()

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content: "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer"
      }

      for(let i =0; i < category.length; i++){
        for(let j=0; j < category[i].itemId.length; j++){
          const item = await Item.findOne({_id: category[i].itemId[j]._id})
          item.isPopular = false;
          await item.save()
          if(category[i].itemId[0] == category[i].itemId[j]){
            item.isPopular = true;
            await item.save()
          }
        }
      }

      res.json({
        metadata:{
          status:200,
          message:'Berhasil'
        },
        response:{
          hero:{
            travelers : treveler.length,
            treasure : treasure.length,
            city : city.length
          },
          mostPicked,
          category,
          testimonial
        }
      })
    }catch(err){
      res.json({
        metadata:{
          status:400,
          message:err.message
        },
        response:[]
      })
    }
  },

  detailItem:async(req, res)=>{
    try{
      const { id } = req.params
      const item = await Item.findOne({_id : id})
        .populate({path:'imageId', select:'_id imageUrl'})
        .populate({path:'featureId', select:'_id name qty imageUrl'})
        .populate({path:'activityId', select:'_id name type imageUrl'})

      const bank = await Bank.find()
      
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content: "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer"
      }

      res.json({
        metadata:{
          status:200,
          message:"Berhasil"
        },
        response:{
          ...item._doc,
          bank,
          testimonial
        }
      })
    }catch(err){
      res.json({
        metadata:{
          status:400,
          message:err.message
        },
        response:[]
      })
    }
  },

  bookingPage:async(req, res)=>{
    const params = {
      idItem, 
      duration,
      // price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body

    if(!req.file){
      return res.json({
        metadata:{
          status:400,
          message:"Image tidak boleh kosong"
        },
        response:[]
      })
    }

    if(idItem == '' || idItem == undefined ||
      duration == '' || duration == undefined ||
      // price == '' || price == undefined ||
      bookingStartDate == '' || bookingStartDate == undefined ||
      bookingEndDate == '' || bookingEndDate == undefined ||
      firstName == '' || firstName == undefined ||
      lastName == '' || lastName == undefined ||
      email == '' || email == undefined ||
      phoneNumber == '' || phoneNumber == undefined ||
      accountHolder == '' || accountHolder == undefined ||
      bankFrom == '' || bankFrom == undefined){
      return res.json({
        metadata:{
          status:400,
          message:"Lengkapi semua field"
        },
        response:[]
      })
    }
    
    const item = await Item.findOne({_id:idItem})
    if(!item){
      res.json({
        metadata:{
          status:404,
          message:"Item tidak ada"
        },
        response:[]
      })
    }
    
    item.sumBooking+=1
    await item.save()

    let total = item.price * duration
    let tax = total * 0.10
    const invoice = Math.floor(1000000+Math.random()*9000000)

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber
    })

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total : total += tax,
      itemId: {
        _id: item.id,
        title:item.title,
        price: item.price,
        duration:item.duration
      },
      memberId: member.id,
      payments:{
        proofPayment:`images/${req.filename}`,
        bankFrom : bankFrom,
        accountHolder:accountHolder,
      }
    }

    const booking = await Booking.create(newBooking)

    res.json({
      metadata:{
        status:200,
        message:"Sukses booking"
      },
      response:{
        booking
      }
    })
  }

}