// Creating the user model for storing the user details
const mongoose = require('mongoose')
const { Schema } = mongoose

// User Schema

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/,'Provide a valid email']},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, },
    token: { type: String },
    expiredAt: { type: Date }
})

exports.User = mongoose.model('User', userSchema)