const authorModel = require("../models/authorModel");
const validation=require('email-validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
require("dotenv").config();
const secret_key=process.env.SECRET_KEY



const createAuthor = async (req, res) => {
    try {
        const author=req.body
        const {fname,lname,title,email,password}=author
        if(Object.keys(author).length===0){
            return res.status(400).send({status:false,msg:"Please provide valid details"})
        }
        if(!fname){
            return res.status(400).send({status:false,msg:"Please provide first name"})
        }
        if(!lname){
            return res.status(400).send({status:false,msg:"Please provide last name"})
        }
        if(!title){
            return res.status(400).send({status:false,msg:"Please provide title"})
        }
        const ValidTitle=["Mr","Mrs","Miss"]
        if(!ValidTitle.includes(title)){
            return res.status(400).send({status:false,mgs:"Makesure title should be one of Mr,Mrs,Miss"})
        }
        if(!email){
            return res.status(400).send({status:false,msg:"Please provide email"})
        }
        if(!validation.validate(email)){
            return res.status(400).send({status:false,msg:"Please provide valid email"})
        }
        const registedEmail=await authorModel.findOne({email:email})
        if(registedEmail) {
            return res.status(400).send({ status: false, msg: "Please give another email address, this email address already registered" });
          }
        if(!password){
            return res.status(400).send({status:false,msg:"Please provide password"})
        }
        const hashPassword=await bcrypt.hash(password,10)
        const authorCreated=await authorModel.create({ fname,lname,title,email,password:hashPassword})
        res.status(201).send({status:true,data:authorCreated})

    } catch (error) {
        res.status(500).send({status:false,msg:error.message})
    }
};



const authorLogin=async function(req,res,next){
    try {
        const UserName=req.body.email
        const UserPassword=req.body.password
        // console.log(UserName);
        // console.log(UserPassword);
        if(!UserName){
            res.status(400).send({status:false,msg:"Please provide username"})
        }
        const user=await authorModel.findOne({email:UserName})
        if(!user){
            return res.status(400).send({status:false,msg:"This User is not registed please register first "})
        }
        if(!UserPassword){
            return res.status(400).send({status:false,msg:"Please provide userpassword"})
        }
        const match=await bcrypt.compare(UserPassword,user.password)
        if(!match){
            return res.status(400).send({status:false,msg:"Please provide correct password"})
        }else{
            const token=jwt.sign({
                userId:user._id.toString(),
                batch:"project-1",
                organization:"group-36"
            },secret_key)
            res.status(200).send({status:true,data:{token:token}})
        }
    } catch (error) {
        res.status(500).send({status:false,msg:error.message})
        
    }
}
const getAllAuthor=async function(req,res){
   try {
    const allUser=await authorModel.find({});
    res.status(200).send({status:true,data:allUser})
   } catch (error) {
    res.status(500).send({status:false,msg:error.message})
    
   }
}




module.exports.createAuthor = createAuthor;
module.exports.authorLogin = authorLogin;
module.exports.getAllAuthor = getAllAuthor;
