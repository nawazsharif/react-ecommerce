const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 32
    },
    hashed_password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },

    salt: String,

    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
)

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    // create temporary variable called _password
    this._password = password
    // generate a timestamp
    this.salt = uuidv1()
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  }
}

// pre middleware
userSchema.pre('remove', function (next) {
  Post.remove({ postedBy: this._id }).exec()
  next()
})

module.exports = mongoose.model('User', userSchema)
