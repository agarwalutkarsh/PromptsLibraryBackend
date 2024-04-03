const userModel = require("../Models/Users"); // importing the user model
const bcrypt = require('bcrypt') // bcrypt used for hashing the password
const jwt = require('jsonwebtoken')

const User = userModel.User // defining the User Model

// Signup Api
exports.createUser = (req, res) => {
    const user = new User()
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, 10, (err, hash) => { // creating hash by providing plain password and salt rounds
        if (err) {
            res.status(400).send(err) // if error occurs response is sent as error
        } else {
            user.email = req.body.email.toLowerCase(),
                user.firstName = req.body.firstName,
                user.lastName = req.body.lastName,
                user.password = hash // setting password field as hash
            user.token = jwt.sign({ email: user.email, firstName: user.firstName, lastName: user.lastName }, process.env.SECRET)
            user?.save().then(() => {
                res.status(201).json({ message: 'User Created Successfully', token: user.token })
            }).catch((err) => res.status(400).send(err))
        }
    })
}

// Login Api
exports.loginUser = async (req, res) => {
    // Extracting email from request body
    const email = req?.body?.email?.toLowerCase()
    const password = req?.body?.password
    try {
        // if email or password is missing
        if (!email || !password) {
            res.status(400).send('Email and Password are Required')
        } else {
            // Checking if the user exists
            const isValidUser = await User.findOne({ email })
            // if valid user then generate a token and send to the client with some basic details.
            if (isValidUser) {
                // match password
                // Extracting the password from the DB
                const hashedPassword = isValidUser?.password
                // Comparing Passwords
                bcrypt.compare(password, hashedPassword, (err, result) => {
                    if (err) {
                        // return error
                        res.status(401).send('Unauthorized user! Check credentials')
                    } else if (result) {
                        // Creating jwt object
                        const jwtObj = {
                            email: isValidUser?.email,
                            firstName: isValidUser?.firstName,
                            lastName: isValidUser?.lastName
                        }
                        // generating new token
                        const newToken = jwt.sign({ ...jwtObj }, process.env.SECRET, { expiresIn: "24h" })
                        // assigning new token to the user
                        isValidUser.token = newToken
                        isValidUser?.save().then(() => {
                            // Passing response after successfull login
                            res?.status(200).json({ message: 'Logged In Successfully', data: { ...jwtObj, token: newToken } })
                        }).catch(err => res.status(401).send(err)) // passing error on error
                    } else {
                        res.status(401).send('Password Incorrect') // if not matched, then password incorrect
                    }
                })
            } else {
                res.status(401).send('Invalid Email')
            }
        }
    } catch (err) {
        res.status(401).send('Unauthorized user! Check credentials')
    }
}