const express = require('express')
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')

const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo, listSearch
} = require('../controllers/product')
const { userById } = require('../controllers/user')

// route - Create a new product
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create)
// route - View product by product id
router.get('/product/:productId', read)
// route - Update product by product id
router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
)
// route - delete product by product id
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
)
// route - All Product List
router.get('/products', list)
router.get('/products/related/:productId', listRelated)
// route - category list by product
router.get('/products/categories', listCategories)
// route - make sure its post
router.post('/product/by/search', listBySearch)
// route - make sure its
router.get('/products/search', listSearch)
// route - product photo
router.get('/product/photo/:productId', photo)

router.param('userId', userById)
router.param('productId', productById)
module.exports = router
