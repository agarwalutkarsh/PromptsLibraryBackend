// This file has all the logic for the post api - CRUD and other operation if needed

const postModel = require('../Models/Post') // importing the post model

const Post = postModel.Post // defining the Post from its model

// Create API
exports.createPost = (req, res) => {
    const post = new Post()
    post.prompt = req?.body?.prompt
    post.category = req?.body?.category
    post.userEmail = req?.body?.userEmail
    post?.save().then(() => {
        res.status(201).json(post)
    }).catch((err) => res.status(400).send(err))
}

// Get all posts
exports.getAllPosts = async (req, res) => {
    const data = await Post.find()
    res.send(data)
}

// Get post by category
exports.getPostsByCategory = async (req, res) => {
    try {
        const categoryQuery = req.params.category.toLowerCase() ?? ''
        const data = await Post.find()
        const filteredData = data?.filter(ele => ele?.category.toLowerCase().includes(categoryQuery))
        res.send(filteredData)
    } catch (err) {
        res.status(404).send(err)
    }

}

exports.getPostsByEmail = async (req, res) => {
    try {
    const userEmail = req.verifiedUser.email
    const posts = await Post.find()
    const filteredData = posts?.filter(ele => ele?.userEmail === userEmail)
    res.send(filteredData)
    } catch (err) {
        res.send(err)
    }
}

exports.getPostById = async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findById(id)
        if (post) {
            res.send(post)
        } else {
            res.status(404).send('Not found')
        }
    } catch (err) {
        res.send(err)
    }
}


// Delete Post by id
exports.deletePostById = async (req, res) => {
    try {
        const id = req?.query?.id
        const post = await Post.findByIdAndDelete(id) // this will return the post before deleting
        if (post) {
            res.send(post)
        } else {
            res.send('Item Not Found')
        }
    } catch (err) {
        res.send(err)
    }
}

// Update Post by id
exports.updatePostById = async (req, res) => {
    try {
        const id = req?.params?.id
        const body = req?.body
        const updatedPost = await Post.findByIdAndUpdate(id, body, { new: true }) // this will return the newly updated post
        if (updatedPost) {
            res.status(201).send(updatedPost)
        } else {
            res.send('Failed')
        }
    } catch (err) {
        res.send(err)
    }
}