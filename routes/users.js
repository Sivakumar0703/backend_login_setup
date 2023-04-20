var express = require('express');
var router = express.Router();
const { userModel } = require('../schemas/userSchema');
const mongoose = require('mongoose');
const { dbUrl } = require('../common/dbconfig');
const { hashPassword, hashCompare, createToken, validate,adminLogin } = require('../common/authorise') // for password protection

mongoose.connect(dbUrl)

/* GET users listing. */
// get all data
router.get('/',validate, adminLogin, async function (req, res) { // if the validate section is processed then only this route will exist
  try {
    let user = await userModel.find();
    res.send( {user, message: "user data fetched successful" })
  } catch (error) {
    res.send({ message: 'data fetching unsuccessful' }, error)
  }
});

/* // same program is written below with password encryption
router.post('/signup', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email }) //  The findOne() returns first document if query matches otherwise returns null. The find() method does not return null, it returns a cursor.
    if (!user) { // checking its a new user or not. if yes then proceed , else 'display msg'
      let user = await userModel.create(req.body);
      res.status(201).send({
        message: "user signup successful"
      })
    } else {
      res.status(400).send({ message: 'user already exists' })
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error", error

    })
    console.log(error)
  }
}) */


// get data by id  // http://localhost:8000/users/643e335b6a535d6924c25386
router.get('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id })
    res.status(201).send({
      message: "user data fetched successful",
      user
    })
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error", error

    })
    console.log(error)
  }
})


// delete user by id
router.delete('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id })
    if(user){
      let user = await userModel.deleteOne({ _id: req.params.id })
      res.status(200).send({
        message: "user deleted successful"
      })
    }
  
  } catch (error) {
    res.status(500).send({
      message: "deleting was unsuccessful.user doesn't exists", error

    })
    console.log(error)
  }
})

// update user bu updateOne // i) when you use updateOne it won't follow the validation given in userSchema ii) you can only enter the fields which are defined in userSchema even if you enter new property it wont take it.
/* 
router.put('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id })
    if(user){
      let user = await userModel.updateOne({ _id: req.params.id })
      res.status(200).send({
        message: "updated successful"
      })
    }
  
  } catch (error) {
    res.status(500).send({
      message: ".user doesn't exists", error

    })
    console.log(error)
  }
}) */


// update without violating validation defined in schema
router.put('/:id', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.id })
    if(user){
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.password

      await user.save()

      res.status(200).send({
        message: "updated successful"
      })
    }
  
  } catch (error) {
    res.status(500).send({
      message: ".user doesn't exists", error

    })
    console.log(error)
  }
})




// encrypting password 
router.post('/signup', async (req, res) => {
  try {
    let hashedPassword = await hashPassword(req.body.password) // passing the password to 'hashpassword'
    req.body.password = hashedPassword // hashedpassword - returned from haspassword & we are masking the password here

    let user = await userModel.create(req.body);
    res.status(201).send({
      message: "user signup successful"
    })
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error", error

    })
    console.log(error)
  }
})


router.post('/login', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email })
    if (await hashCompare(req.body.password, user.password)) { // req.body.password(from application) = entered by user & user.password(from DB) = encrypted password(hashedpassword)
      // creating a token

      let token = await createToken({
        name: user.name,
        email: user.email,
        id: user._id,
        role: user.role
      })

      res.status(200).send({
        message: "login successful",
        token
      })
    }

    else {
      res.status(402).send({ message: "invalid password" })
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error", error

    })
    console.log(error)
  }
})



module.exports = router;