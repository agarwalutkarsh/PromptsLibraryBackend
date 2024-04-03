const express = require('express')
const { createPost, deletePostById, updatePostById, getPostsByEmail, getPostById } = require('../Controllers/Post')
const postRouter = express.Router()


postRouter
    .get('/myposts', getPostsByEmail)
    .get('/:id', getPostById)
    .post('/', createPost)
    .delete('/', deletePostById)
    .patch('/:id', updatePostById)

exports.postRouter = postRouter