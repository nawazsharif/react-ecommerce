const express = require('express')
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')

const {
  create,
  categoryByID,
  read,
  update,
  remove,
  list
} = require('../controllers/category')
const { userById } = require('../controllers/user')

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)
router.get('/category/:categoryId', read)
router.put(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
)
router.delete(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
)
router.get('/categories', list)

router.param('userId', userById)
router.param('categoryId', categoryByID)
module.exports = router
