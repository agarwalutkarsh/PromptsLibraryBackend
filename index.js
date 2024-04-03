// This file is the main file and consists of only DB Connection, Server Startup, Middlewares and Routers.
// All the logic for the particular api is in the controller whose schema is defined in models

require('dotenv').config() // for accessing the .env file from dotenv library
const express = require('express')
const cors = require('cors') // for enabling the cors
const jwt = require('jsonwebtoken') // jwt token library
const mongoose = require('mongoose'); // importing the mongoose
const { postRouter } = require('./Routes/Post'); // where all the different routes are defined for posts
const { authRouter } = require('./Routes/Auth'); // routes for the auth flow
const { allPostsRouter } = require('./Routes/AllPost');

//db connection
main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb+srv://{UserName}:{Password}@prompt-cluster.nuv27pg.mongodb.net/prompts')
  await mongoose.connect(`${process.env.STRING}`)
  console.log('DB Connected')
}

const server = express() // defining server

// Auth Middleware
const auth = (req, res, next) => {
  // const token = req.headers.authorization?.split('Bearer ')?.[1] // there are two ways of getting the "Authorization"
  const token = req.get('Authorization')?.split('Bearer ')?.[1]
  try {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send(err)
      } else {
        req.verifiedUser = decoded // adding the property verifiedUser to the value of decoded token so that it can be used in the posts api 
        next()
      }
    })
  } catch (err) {
    res.status(401).send('You Are Unauthorized!')
  }
}

server.use(cors()) // middleware for enabling cors
server.use(express.json()) // body parser
// auth flow does not need token - create and login does not require the user to have token
server.use('/api/post', auth, postRouter) // at /api/post all the routes for posts will be hit
server.use('/api/allPosts', allPostsRouter)
server.use('/api/auth', authRouter)

server.listen(8080, () => console.log('Server Started')) // starting the server