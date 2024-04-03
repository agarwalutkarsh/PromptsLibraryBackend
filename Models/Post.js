const mongoose = require('mongoose') // requiring mongoose
const { Schema } = mongoose // defining schema

// Prompt Schema
const postSchema = new Schema({
    prompt: { type: String, required: [true, 'Prompt is required'], unique: [ true, 'This prompt already exists' ] },
    category: { type: String, required: [true, 'Category is reqiuired'] },
    userEmail: { type: String, required: [true, 'User Email is required while creating the post'] }
})

exports.Post = mongoose.model('Post', postSchema)