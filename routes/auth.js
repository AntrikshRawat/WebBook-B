/* eslint-disable no-unused-vars */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User");
const fetchuser = require('../middleware/fetchuser');
const { validationResult, body } = require('express-validator');
const sendEmail = require("../middleware/Verification");
let success = false;
const SECRET_SIGN = 'vijay';
//Create a User Using:POST "/api/auth/createuser". No login requires
router.post('/register', [
  //check if all the values are in proper format
  body('name','name length should be greater than 3').isLength({ min: 3 }),
  body('email','enter a valid email').isEmail(),
  body('password','password length should greater than 8').isLength({ min: 8 })
], async (req, res) => {
  //if there is no proper fromat then this error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success ,errors: errors.array() });
  }
  //if no errror are present 
  //beginning of creating a user
  //first check if user already exist
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      success = false;
      return res.status(400).json({success , msg: "User with this email already exist" });
    };
    //accessing the password converting into hash format for security
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const user_token = jwt.sign(data, SECRET_SIGN);
    success = true;
    res.json({success , user_token });
  } catch (error) {
    console.error(error);
    success = false;
    res.status(500).send(success ,"some error occured");
  }

  //.then(user => res.json(user)).catch(error => {;
  //           res.json({
  //                     error:error.message.slice(7,50),
  //                     msg:"email already exist"
  //           })
  //  }); 
  // const newUser =  User(req.body);
  // user.save()
  // res.send(user);
})



//authenticate user Using:POST "/api/auth/login". No login requires
router.post('/login',[
  body('email',"enter a valid email").isEmail(),
  body('password','password cannot be empty').exists()
],async(req , res)=>{
    //check if all the values are in proper format
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }
  const {email , password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user) {
      success = false;
      return res.status(400).json({success ,error:"Invalid Credentials"});
    }
    const passCompare = await bcrypt.compare(password , user.password);
    if(!passCompare) {
      success = false;
      return res.status(400).json({success ,error:"Invalid Credentials"});
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const user_token = jwt.sign(data, SECRET_SIGN);
    success = true;
    res.json({success , user_token });
  } catch (error) {
    console.error(error);
    success = false;
    res.status(500).send(success ,"some error occured");
  }
})

// router.put('/temp',async(req ,res)=>{
//   let dev = await User.findById("66c62f05a9703921e44d0e7a");
//   let newpass = "password123";
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(newpass, salt);
//   dev.password = hashedPassword;
//   dev.save();
//   return res.json("password changed");
// })
//get the details of loggedin user by POST:"/auth/getuser" login required
router.post('/getuser',fetchuser,async (req,res)=>{
try {
  let userId = req.user.id;
  const user =  await User.findById(userId).select("-password");
  success = true;
  res.send({success ,user});
} catch (error) {
  success = false;
  res.status(500).send("Invalid AuthToken");
}
})
router.put('/verification',fetchuser,async(req , res)=>{
try{
    let userId = req.user.id;
  const userInfo = await User.findById(userId);
    let result = await sendEmail(userInfo.email);
      res.json(result);
}catch(error){
  res.send(error);
}
})
router.post('/resetpassword',fetchuser,async(req,res)=>{
try{ 
    let userId = req.user.id;
    const userInfo = await User.findById(userId);
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const passCompare = await bcrypt.compare(hashedPassword,userInfo.password);
    if(passCompare) {
     return res.json("New and Old Password can't be same");
    }
    userInfo.password = hashedPassword;
    userInfo.save();
    res.json("password updated successfully");
}catch(error){
  res.json("Internal Server Error");
}
})
module.exports = router;