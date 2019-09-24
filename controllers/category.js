const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.categoryByID = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: 'category not found'
      })
    }
    req.category = category
    next()
  })
}
exports.read = (req, res) => {
  return res.json(req.category)
}

exports.create = (req, res, next) => {
  const category = new Category(req.body)
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json({ data })
  })
}
exports.update = (req, res) => {
  let category = req.category
  category.name = req.body.name
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Category doesn't exist"
      })
    }
    res.json({ message: 'Category updated successful' })
  })
}
exports.remove = (req, res) => {
  let category = req.category
  category.name = req.body.name
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Category doesn't exist"
      })
    }
    res.json({ message: 'Category deleted successful' })
  })
}
exports.list = (req, res) => {
  Category.find().exec((err, categoryList) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json(categoryList)
  })
}
