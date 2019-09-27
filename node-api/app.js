const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
require('dotenv').config()

// import router
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')

const app = express()
// db connection
mongoose
  .connect(
    process.env.Database,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log('db connection')
  })

// middleware

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

// routes middleware
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)

// app.use(expressValidator())
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
