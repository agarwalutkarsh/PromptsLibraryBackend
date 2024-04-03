const express = require('express')
const { createUser, loginUser } = require('../Controllers/Auth')
const authRouter = express.Router()

authRouter
.post('/signup', createUser )
.post('/login', loginUser)

exports.authRouter = authRouter