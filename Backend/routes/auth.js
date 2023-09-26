const express = require('express')
const router = express.Router()
const jwt=require('jsonwebtoken')
const {requireSignin}=require('../middleware')
const {promisify}=require("util")
const Signup=require('../models/signup');
const { token } = require('morgan');
require("dotenv").config({path: '../../.env'});
const JWT_SECRET='secret';
const JWT_EXPIRES=process.env.JWT_EXPIRES
const NODE_ENV=process.env.NODE_ENV


const signJwt=(id)=>{
    return jwt.sign({id},JWT_SECRET,{
        expiresIn: JWT_EXPIRES
    })
}

const sendToken=(user,statuscode,req,res)=>{

    const token=signJwt(user._id)
    res.cookie("jwt",token,{
        expires:new Date(Date.now()+JWT_EXPIRES),
        secure: NODE_ENV==='production'? true:false,
        httpOnly:NODE_ENV==='production'? true:false
    })
    console.log("Inside send token")
    res.status(statuscode).json({
        token,
    })
}

const signout=(req,res)=>{
    res.clearCookie('token')
    res.status(200).json({
        message:"Signed out successfully !"
    })
}

const decryptJwt=async(token)=>{
    const jwtverify=promisify(jwt.verify)
    return await jwtverify(token,JWT_SECRET)
}
secure=async (req,res,next)=>{
    let token
    if(req.cookies) token=req.cookies.jwt
    if(!token){
        return res.status(401).json({
            status:"unauthorized",
            message:"You are not authorized to view the content"
        })
    }
    const jwtInfo=await decryptJwt(token)
    console.log(jwtInfo)
    const user=await Signup.findById(jwtInfo.id)
    req.user=user
    next()
}

checkField=(req,res,next)=>{
    var firstname=req.body.email
    var email=req.body.email
    var password=req.body.password
    var cpassword=req.body.cpassword
    if(!firstname || !email || !password || !cpassword){
        console.log('Please enter all the fields')
        res.send('Please enter all the fields')
    }
    else{
        next()
    }

}


checkFieldLogin=(req,res,next)=>{
    var email=req.body.email
    var password=req.body.password
    if(!email || !password){
        console.log('Please enter all the fields')
        res.send('Please enter all the fields')
    }
    else{
        next()
    }

}

function checkUsername(req,res,next){
    var email=req.body.email
    var checkExistUsername=Signup.findOne({email:email})
    checkExistUsername.exec((err,data)=>{
        if(err)throw err
        if(data){
            console.log('Email Exists')
            res.send('Email already exists')
        }
        else{
            next()
        }
    })    
}
function checkPassword(req,res,next){
    var password=req.body.password
    var cpassword=req.body.cpassword
    if(password!=cpassword){
        console.log('Password did not matched')
        res.send('Password did not matched')
    }
    else{
        next()
    }  
}

router.get('/',(req,res)=>res.send("Home page"))

router.post('/signup',checkField,checkUsername,checkPassword,async (req,res)=>{
    console.log("Signup :", req.body)
    var firstname=req.body.firstname
    var lastname=req.body.lastname
    var email=req.body.email
    var number=req.body.number
    var password=req.body.password

    try{
        const newSignup = await Signup.create({
            firstname:firstname,
            lastname:lastname,
            email:email,
            number:number,
            password:password
        })
        console.log(newSignup)
        res.send("Done")
    }
    catch(err){
        res.status(401).json(err.message);
    }
})
router.post('/login',checkFieldLogin,(req,res,next)=>{
    console.log('Login :',req.body)
    const email=req.body.email
    const password=req.body.password

    var checkUser=Signup.findOne({email:email})
    checkUser.exec((err,data)=>{
        if(!data){
            console.log('Not exist')
            res.send("Email does not exist")
        }
        else{
            var dbpassword=data.password
            if(dbpassword==password){
                console.log("Logging in")
                const jwt_token=jwt.sign({_id:data._id,role:"user"},'secret',{expiresIn: '1hr'})
                res.cookie('token',token,{expiresIn:'1hr'})
                res.status(200).json({
                    jwt_token,
                    user: data
                })
                console.log("Login successfull")
            }
            else{
                console.log('Please check again !')
                res.send("Password Incorrect")
            }
        }
    })
})
router.post('/checktoken',requireSignin,(req,res)=>{
    res.status(200).json({})
})
router.post('/signout',requireSignin, signout)
router.post('/feed',requireSignin,(req,res)=>res.status(200).json({
    message:"Working fine"
}))


module.exports = router;