const router = require('express').Router()
const adminController = require('../controllers/AdminController')
const {upload, uploadMultiple } = require('../middlewares/multer')
const auth = require('../middlewares/auth')

router.get('/signin',adminController.viewSignIn);
router.get('/logout',adminController.signOut);
router.post('/actionSignin',adminController.signIn);
router.use(auth)

router.get('/dashboard',adminController.viewDashboard);

router.get('/category',adminController.viewCategory)
router.post('/category',adminController.addCategory)
router.put('/category',adminController.editCategory)
router.post('/deleteCategory',adminController.deleteCategory)

router.get('/bank',adminController.viewBank)
router.post('/bank',upload,adminController.addBank)
router.put('/bank',upload,adminController.editBank)
router.post('/deleteBank',adminController.deleteBank)

router.get('/item',adminController.viewItem)
router.post('/item',uploadMultiple,adminController.addItem)
router.get('/item/show-image/:id',adminController.showImageItem)
router.get('/item/:id',adminController.showEditItem)
router.put('/editItem',uploadMultiple,adminController.editItem)
router.post('/deleteItem',adminController.deleteItem)

router.get('/item/detail_item/:id',adminController.viewDetailItem)
router.post('/item/add_feature',upload, adminController.addFeature)
router.post('/deleteFeature',adminController.deleteFeature)
router.post('/item/add_activity',upload,adminController.addActivity)
router.post('/deleteActivity',upload,adminController.deleteActivity)

router.get('/booking',adminController.viewBooking)
router.get('/detail_booking/:id',adminController.detailBooking)
router.post('/booking/action',adminController.actionConfirmation)

module.exports = router