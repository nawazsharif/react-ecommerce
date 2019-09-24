const formidable = require('formidable')
const _ = require('lodash')
const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')
const fs = require('fs')

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: 'Product not found'
      })
    }
    req.product = product
    next()
  })
}

exports.read = (req, res) => {
  req.product.photo = undefined
  return res.json(req.product)
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'image cold not upload'
      })
    }
    const { name, price, description, category, quantity, shipping } = fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All file required'
      })
    }
    let product = new Product(fields)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'image should be less then 1mb'
        })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      res.json(result)
    })
  })
}

exports.update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'image cold not upload'
      })
    }
    const { name, price, description, category, quantity, shipping } = fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All file required'
      })
    }
    let product = req.product
    product = _.extend(product, fields)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'image should be less then 1mb'
        })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      res.json({
        message: 'product update successful'
      })
    })
  })
}

exports.remove = (req, res) => {
  let product = req.product

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        // error: "Product not found"
        error: errorHandler(err)
      })
    }
    res.json({
      message: 'Product deleted successfully'
    })
  })
}

/*
 *  sells /arrival
 * by sell =  /products?sortBy=sold&order=desc&limit=4
 * by arrival =  /products?sortBy=createdAt&order=desc&limit=4
 * if no params are send then show all product return
 */

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'

  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  let limit = req.query.limit ? parseInt(req.query.limit) : 6
  console.log(limit)
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    // .limit(limit)
    .exec((err, productList) => {
      if (err || !productList) {
        return res.status(400).json({
          error: 'No Product found'
        })
      }
      res.send(productList)
    })
}

/**
 * it will find all product based on similar category
 */

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .select('-photo')
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: 'No Product found'
        })
      }
      res.json(products)
    })
}
exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categoryList) => {
    if (err || !categoryList) {
      return res.status(400).json({
        error: 'No category found'
      })
    }
    res.json(categoryList)
  })
}
