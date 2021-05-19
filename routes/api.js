const router = require('express').Router()
const apiController = require('../controllers/ApiController')
const { upload } = require('../middlewares/multer')

router.get('/landing_page',apiController.landingPage)
router.get('/detail_item/:id',apiController.detailItem)
router.post('/booking_page',upload, apiController.bookingPage)

module.exports = router