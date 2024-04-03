const express = require('express')
const { getAllPosts, getPostsByCategory } = require('../Controllers/Post')
const allPostsRouter = express.Router()

allPostsRouter
.get('/', getAllPosts)
.get('/:category', getPostsByCategory)

exports.allPostsRouter = allPostsRouter