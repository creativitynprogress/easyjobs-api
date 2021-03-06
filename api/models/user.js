const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const userSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        fbId: { type: String, sparse: true },
        image: { type: String },
        password: { type: String },
        name: { type: String },
        role: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User',
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Date
        }
        }, {
        timestamps: true
        })


//  Pre-save of user to db, hash password if password is modified or new
userSchema.pre('save', function (next) {
    const user = this
    const SALT_FACTOR = 5
  
    if (!user.isModified('password')) return next()
  
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
      if (err) return next(err)
  
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  })
  

//  Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  }


module.exports = mongoose.model('User', userSchema)