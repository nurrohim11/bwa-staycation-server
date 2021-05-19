const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Item = require('../models/Item')
const Image = require('../models/Image')
const Feature = require('../models/Feature')
const Activity = require('../models/Activity')
const fs = require('fs-extra')
const path = require('path')
const Users = require('../models/Users')
const bycript = require('bcryptjs')
const Booking = require('../models/Booking')
const Member = require('../models/Member')

module.exports = {

  viewSignIn:(req,res)=>{
    try {
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      if(req.session.user == null || req.session.user == undefined){
        res.render('index',{alert,title:'Staycation | Login'})
      }
      else{
        res.redirect('/admin/dashboard')
      }
    }catch(err){
      res.redirect('/admin/signin')
    }
  },

  signIn:async(req, res)=>{
    try{
      const { username, password } =req.body
      const user = await Users.findOne({username:username})
      if(!user){
        req.flash('alertMessage','User tidak ditemukan')
        req.flash('alertStatus','danger')
        res.redirect('/admin/signin') 
      }
      const isPasswordMatch = await bycript.compare(password, user.password);
      if(!isPasswordMatch){
        req.flash('alertMessage','Password yang anda masukkan tidak cocok')
        req.flash('alertStatus','danger')
        res.redirect('/admin/signin')
      }

      req.session.user = {
        id: user.id,
        username:user.username
      }

      res.redirect('/admin/dashboard')
    }catch(err){
        res.redirect('/admin/signin') 
    }
  },

  signOut:(req, res)=>{
    req.session.destroy()
    res.redirect('/admin/signin')
  },

  viewDashboard:async(req, res)=>{
    try {
      const member = await Member.find()
      const booking = await Booking.find()
      const item = await Item.find()
      res.render('admin/dashboard',{
        title:'Staycation | Dashboard', 
        user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest',
        member,
        booking,
        item
      })
    }catch(err){
      res.render('admin/dashboard',{
        title:'Staycation | Dashboard', 
        user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'
      })
    }
  },
  viewCategory:async(req, res)=>{
    try {
      const category = await Category.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      res.render('admin/category',{category,alert,title:'Staycation | Data Category', user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'})
    }catch(err){
      res.redirect('admin/category')
    }
  },
  addCategory:async(req, res)=>{
    try{
      const { name } = req.body
      await Category.create({name});
      req.flash('alertMessage','Success add category')
      req.flash('alertStatus','success')
      res.redirect('/admin/category') 
    }catch(err){
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect('/admin/category') 
    }
  },
  editCategory:async(req, res)=>{
    const { id, name } = req.body
    const category = await Category.findOne({_id : id})
    category.name = name
    category.save()
    res.redirect('/admin/category')
  },
  deleteCategory:async(req, res)=>{
    const { id } = req.body
    const category = await Category.findOne({_id:id})
    category.remove()
    res.sendStatus(200)
  },

  // module bank
  viewBank:async(req, res)=>{
    try {
      const bank = await Bank.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      res.render('admin/bank',{bank,alert,title:'Staycation | Data Bank', user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'})
    }catch(err){
      res.redirect('admin/bank',{title:'Staycation | Data Bank'})
    }
  },

  addBank:async(req,res)=>{
    try{
      const { name_bank, no_rekening, nama_rekening } = req.body
      await Bank.create({
        nameBank: name_bank,
        name:nama_rekening,
        nomorRekening:no_rekening,
        imageUrl:`images/${req.file.filename}`
      });
      req.flash('alertMessage','Success add bank')
      req.flash('alertStatus','success')
      res.redirect('/admin/bank') 
    }catch(err){
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect('/admin/bank') 
    }
  },

  editBank:async(req, res)=>{
    try{
      const { _id, name_bank, no_rekening, nama_rekening } = req.body
      const bank = await Bank.findOne({_id:_id})
      if(req.file == undefined){
        bank.nameBank = name_bank
        bank.name = nama_rekening 
        bank.nomorRekening = no_rekening
        await bank.save()
        req.flash('alertMessage','Success edit bank')
        req.flash('alertStatus','success')
        res.redirect('/admin/bank') 
      }
      else{
        await fs.unlink(path.join(`public/${bank.imageUrl}`))
        bank.nameBank = name_bank
        bank.name = nama_rekening 
        bank.nomorRekening = no_rekening
        bank.imageUrl = `images/${req.file.filename}`
        await bank.save()
        req.flash('alertMessage','Success edit bank')
        req.flash('alertStatus','success')
        res.redirect('/admin/bank') 
      }
    }catch(err){

    }
  },

  deleteBank:async(req,res)=>{
    const { id } = req.body
    console.log(id)
    const bank = await Bank.findOne({_id:id})
    await fs.unlink(path.join(`public/${bank.imageUrl}`))
    await bank.remove()
    res.sendStatus(200)
  },

  viewItem:async(req, res)=>{
    try{
      const item = await Item.find()
        .populate({path:'imageId',select:`id imageUrl`})
        .populate({path:'categoryId',select:`id name`})
      const category = await Category.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      res.render('admin/item',{title:'Staycation | Data Item',item,alert,category,action:'view', user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'})
    }catch(err){
      res.render('admin/item',{title:'Staycation | Data Item'})
    }
  },

  addItem :async(req,res)=>{
    try{
      const { title, price, city, categoryId, description } = req.body
      if(req.files.length > 0){
        const category = await Category.findOne({_id:categoryId})
        const newItem = {
          categoryId:category._id,
          title,
          description,
          price,
          city
        }
        const item = await Item.create(newItem)
        category.itemId.push({_id:item._id})
        await category.save()
        for (let i = 0; i<req.files.length; i++){
          const imageSave = await Image.create({imageUrl:`images/${req.files[i].filename}`})
          item.imageId.push({_id:imageSave._id})
          await item.save()
        }
        req.flash('alertMessage','Success add item')
        req.flash('alertStatus','success')
        res.redirect('/admin/item',{user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'}) 
      }
    }catch(err){
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect('/admin/item') 
    }
  },

  showImageItem:async(req,res)=>{
    try{
      const {id} = req.params  
      const item = await Item.findOne({_id:id})
        .populate({path:'imageId',select:`id imageUrl`})
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      res.render('admin/item',{title:'Staycation | Show Image Item',item,alert,action:'show image', user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'})
    }catch(err){
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect('/admin/item') 
    }
  },

  showEditItem:async(req,res)=>{
    try{
      const {id} = req.params  
      const item = await Item.findOne({_id:id})
        .populate({path:'imageId',select:`id imageUrl`})
        .populate({path:'categoryId',select:`id name`})
      const category = await Category.find()
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      res.render('admin/item',{
        title:'Staycation | Show Image Item',
        item,
        category,
        alert,
        action:'edit'
      })
    }catch(err){
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect('/admin/item') 
    }
  },

  editItem:async(req,res)=>{
    try{
      const { id, title, price, city, categoryId, description } = req.body
      const item = await Item.findOne({_id:id})
        .populate({path:'imageId',select:`id imageUrl`})
        .populate({path:'categoryId',select:`id name`})
      // console.log(req.files)
      if(req.files.length > 0){
        for(let i = 0; i<item.imageId.length; i++){
          const imageUpdate = await Image.findOne({_id:item.imageId[i]._id});
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`))
          imageUpdate.imageUrl = `images/${req.files[i].filename}`
          await imageUpdate.save()
        }
        item.title = title
        item.price = price
        item.city = city
        item.description = description
        item.categoryId = categoryId        
        await item.save()
        req.flash('alertMessage','Success update item')
        req.flash('alertStatus','success')
        res.redirect('/admin/item') 
      }
      else{
        item.title = title
        item.price = price
        item.city = city
        item.description = description
        item.categoryId = categoryId        
        await item.save()
        req.flash('alertMessage','Success update item')
        req.flash('alertStatus','success')
        res.redirect('/admin/item') 
      } 
    }catch(err){
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect('/admin/item') 
    }
  },
  
  deleteItem:async(req, res)=>{
    const { id } = req.body
    const item = await Item.findOne({_id:id})
      .populate('imageId')

    for (let i = 0; i<item.imageId[i].length;i++){
      Image.findOne({_id:item.imageId[i]._id})
        .then((res)=>{
          fs.unlink(path.join(`public/${image.imageUrl}`))
          image.remove()
        })
        .catch(err=>{
          req.flash('alertMessage',err.message)
          req.flash('alertStatus','danger')
          res.redirect('/admin/item') 
        })
    }
    await item.remove()
    req.flash('alertMessage','Success delete item')
    req.flash('alertStatus','success')
    res.redirect('/admin/item') 
    res.sendStatus(200)
  },

  viewDetailItem:async(req, res)=>{
    try{
      const { id } =req.params
      const feature = await Feature.find({itemId:id})
      const activity = await Activity.find({itemId:id})
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}
      res.render('admin/detailItem',{
        title:'Staycation | Detail Item',
        alert,
        id,
        feature,
        activity, user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'
      })
    }catch(err){
      req.flash('alertMessage',err.message)
      req.flash('alertStatus','danger')
      res.redirect(`/admin/item/detail_item/${id}`) 
    }
  },
  
  addFeature:async(req,res)=>{
    try{
      const { id, name, qty, action, id_feature } = req.body
      if(action == 'add'){
        if(!req.file){
          req.flash('alertMessage','Image feature cannot empty')
          req.flash('alertStatus','danger')
          res.redirect(`/admin/item/detail_item/${id}`) 
        }

        // meniympan fieature
        const feature = await Feature.create({
          name,
          qty,
          itemId:id,
          imageUrl:`images/${req.file.filename}`
        });

        // jika feature tersimpan terus di push ke table item untuk join dalam mongodb
        const item = await Item.findOne({_id:id})
        item.featureId.push({_id:feature._id})
        await item.save()
        req.flash('alertMessage','Success add feature')
        req.flash('alertStatus','success')
        res.redirect(`/admin/item/detail_item/${id}`) 
      }
      else{
        const feature = await Feature.findOne({_id:id_feature})
        if(req.file == undefined){
          feature.name = name
          feature.qty = qty 
          await feature.save()
          req.flash('alertMessage','Success edit feature')
          req.flash('alertStatus','success')
          res.redirect(`/admin/item/detail_item/${id}`) 
        }
        else{
          await fs.unlink(path.join(`public/${feature.imageUrl}`))
          feature.name = name
          feature.qty = qty 
          feature.imageUrl = `images/${req.file.filename}`
          await feature.save()
          req.flash('alertMessage','Success edit feature')
          req.flash('alertStatus','success')
          res.redirect(`/admin/item/detail_item/${id}`) 
        }
      }

    }catch(err){
      const { id } = req.body
      req.flash('alertMessage',`${err.message}`)
      req.flash('alertStatus','danger')
      res.redirect(`/admin/item/detail_item/${id}`) 
    }
  },

  deleteFeature:async(req,res)=>{
    const { id,itemId } = req.body
    const feature = await Feature.findOne({_id:id})
    const item = await Item.findOne({_id:itemId}).populate('featureId')
      for(let i=0; i<item.featureId.length; i++){
        if(item.featureId[i]._id.toString() == id.toString()){
          item.featureId.pull({_id:id})
          await item.save()
        }
      }
    await fs.unlink(path.join(`public/${feature.imageUrl}`))
    await feature.remove()
    res.sendStatus(200)
  },

  addActivity:async(req,res)=>{
    const { item_id, action, id_activity, name_activity, type} = req.body
    try{
      if(action == 'add'){
        if(!req.file){
          req.flash('alertMessage','Image activity cannot empty')
          req.flash('alertStatus','danger')
          res.redirect(`/admin/item/detail_item/${item_id}`) 
        }
        const activity = await Activity.create({
          name:name_activity,
          type:type,
          itemId:item_id,
          imageUrl : `images/${req.file.filename}`
        })
        const item = await Item.findOne({_id:item_id})
        item.activityId.push({_id:activity._id})
        item.save()
        req.flash('alertMessage','Success add activity')
        req.flash('alertStatus','success')
        res.redirect(`/admin/item/detail_item/${item_id}`) 
      }
      else{
        const activity = await Activity.findOne({_id:id_activity})
        if(req.file == undefined){
          activity.name = name_activity
          activity.type= type
          await activity.save()
          req.flash('alertMessage','Success edit activity')
          req.flash('alertStatus','success')
          res.redirect(`/admin/item/detail_item/${item_id}`) 
        }
        else{
          await fs.unlink(path.join(`public/${activity.imageUrl}`))
          activity.name = name_activity
          activity.type = type
          feature.imageUrl = `images/${req.file.filename}`
          await activity.remove()
          req.flash('alertMessage','Success edit activity')
          req.flash('alertStatus','success')
          res.redirect(`/admin/item/detail_item/${item_id}`) 
        }
      }
    }catch(err){
      req.flash('alertMessage',err)
      req.flash('alertStatus','danger')
      res.redirect(`/admin/item/detail_item/${item_id}`) 
    }
  },
  
  deleteActivity:async(req,res)=>{
    const { id,itemId } = req.body
    const activity = await Activity.findOne({_id:id})
    const item = await Item.findOne({_id:itemId}).populate('featureId')
      for(let i=0; i<item.activityId.length; i++){
        if(item.activityId[i]._id.toString() == id.toString()){
          item.activityId.pull({_id:id})
          await item.save()
        }
      }
    await fs.unlink(path.join(`public/${activity.imageUrl}`))
    await activity.remove()
    res.sendStatus(200)
  },

  viewBooking:async(req, res)=>{
    try{
      const booking = await Booking.find()
        .populate('memberId')
        .populate('bankId')
      res.render('admin/booking',{
        title:'Staycation | Booking',
        booking,
        user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'
      })
    }catch(err){
      res.render('admin/booking',{
        title:'Staycation | Booking',
        user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'
      })
    }
  },

  detailBooking:async(req,res)=>{
    const { id } = req.params
    try{
      const booking = await Booking.findOne({_id:id})
        .populate('memberId')
        .populate('bankId')
      
      const alertMessage = req.flash('alertMessage')
      const alertStatus = req.flash('alertStatus')
      const alert = {message:alertMessage,status:alertStatus}

      res.render('admin/booking/detail_booking',{
        title:'Staycation | Detail Booking',
        booking,
        user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest',
        alert
      })

    }catch(err){
      res.render('admin/booking/detail_booking',{
        title:'Staycation | Detail Booking',
        user: (req.session.user != null || req.session.user != undefined) ? req.session.user.username : 'Guest'
      })
    }
  },

  actionConfirmation:async(req, res)=>{
    const { id, status } = req.body
    const booking = await Booking.findOne({_id:id})
    booking.payments.status = status
    await booking.save()
    res.sendStatus(200)
  }

}