const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = (req, res) => {
  console.log('req.body', req.body)
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    res.json({
      user
    })
  })
}

exports.signin = (req, res) => {
  // find user based on email
  const { email, password } = req.body
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'email dose not exist'
      })
    }
    // if user found then check email and password natch
    // create authenticate method in model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Password dose not match'
      })
    }
    // generate a signed token with user id

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    // set cookie name "t" with expire date
    res.cookie('t'.token, { expire: new Date() + 9999 })
    const { _id, email, name, role } = user
    return res.json({ token, user: { _id, email, name, role } })
  })
}

exports.signout = (err, res) => {
  res.clearCookie('t')
  res.json({ message: 'logout successful' })
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if (!user) {
    return res.status(403).json({
      error: 'Access denied!'
    })
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access Denied'
    })
  }
  next()
}
