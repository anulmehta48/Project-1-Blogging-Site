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

const authorization = async function (req, res, next) {
    try {  
      const requestBlogId = req.params.blogId
      const BlogData = await blogModel.findById(requestBlogId)
      const blogAuthor = BlogData.authorId.toString()
      if (blogAuthor != req.loggedInUser) {
        return res.status(403).send({ status: false, msg: " Permission is Denied for this User" })
      }
      next()
    } catch (error) {
       return res.status(500).send({status:false,msg:error.message})

    }
  };

  const authorize = async function (req, res, next) {
    try {
      if (Object.keys(req.query).length == 0) {
        return res.status(400).send({ status: false, msg: "please enter a query" })
      }
      const validAuthor = req.loggedInUser
      const savedData = await blogModel.find(req.query)
      if (!savedData[0]) {
        return res.status(404).send({ status: false, msg: "no blog exists with the given query" })
      }
  
      const arr = []
      for (let i = 0; i < savedData.length; i++) {
        if (savedData[i].authorId == validAuthor) {
          arr.push(savedData[i].authorId)
        }
      }
  
      if (arr[0] != validAuthor) {
        return res.status(403).send({ status: false, msg: "you are not authorized" })
      } else {
        next()
      }
  
    } catch (error) {
        res.status(500).send({status:false,msg:error.message})
    }
  }

module.exports.authenticate=authenticate;
module.exports.authorization=authorization;
module.exports.authorize=authorize;