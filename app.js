const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
require('dotenv').config()

// import router
const userRouter = require('./routes/user')

const app = express()
// db connection
mongoose
  .connect(
    process.env.Database,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('db connection')
  })

// routes middleware
app.use('/api', userRouter)
app.use(bodyParser.json())
app.use(cookieParser())
// app.use(expressValidator())
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
