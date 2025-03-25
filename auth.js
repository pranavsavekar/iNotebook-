const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')

const JWT_SECRET = "JonathanisM$VP";

//ROUTE 1: Create an User using : POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min: 3}),
    body('email','Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5}),
], async(req,res)=>{
    let success = false;
    //If there are errors, return Bd request and the errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array() });
    }
    //Check whether the user with this email exists already
    try{
    let user=await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error: "Sorry a user with this email already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
    })
    
    // .then(user => res.json(user))
    // .catch(err=> {console.log(err)
    //     res.json({error: "Please enter an unique value for email", message: err.message})})

    const data={
        user: {
            id: user.id
        }
    }

    const authtoken=jwt.sign(data, JWT_SECRET);
    console.log(authtoken);

    // res.json(user)
    success=true;
    res.json({success, authtoken});
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})


//ROUTE 2: Authenticate an User using : POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async(req,res)=>{
    let success = false;
    //If there are errors, return Bd request and the errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please enter correct credentials"});
        }

        const passwordCompare=await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({error: "Please enter correct credentials"});
        }

        const  data={
            user:{
                id: user.id
            }
        }
        const authtoken=jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken})

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 3: Get logged in User Details using : POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async(req,res)=>{
try {
    userId = req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})
module.exports=router;