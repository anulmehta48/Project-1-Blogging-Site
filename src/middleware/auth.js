const jwt= require('jsonwebtoken');
const blogModel=require('../models/blogModel');


const authenticate=async function(req,res,next){
    try {
        const token=req.headers["x-api-key"];
        if(!token){
            res.status(404).send({status:false,msg:"token must be present"})
        }
        const decodedToken=jwt.verify(token,"functionup-plutonium")
        if(!decodedToken){
            return res.status(401).send({status:false,msg:"token is invalid"})
        }
        if(decodedToken){
            req.loggedInUser=decodedToken.userId;
            // console.log(req.loggedInUser)
            next()
        }
    } catch (error) {
    res.status(500).send({status:false,msg:error.message})
        
    }
}


module.exports.authenticate=authenticate;