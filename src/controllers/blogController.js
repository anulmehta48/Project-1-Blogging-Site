const authorModel = require('../models/authorModel');
const blogModel=require('../models/blogModel');
const mongoose=require('mongoose');

const createBlog=async function(req,res){
   try {
    const blog=req.body;
    const {title,body,authorId,category,isPublished}=blog
    if(Object.keys(blog).length===0){
        return res.status(400).send({status:false,msg:"Please provide valid details"})
    }
    if (!title)
      return res.status(400).send({ status: false, msg: "title is required"});
    if (!body)
      return res.status(400).send({ status: false, msg: "body is required"});
    if (!authorId)
      return res.status(400).send({ status: false, msg: "authorId is required"});
    if (!category)
      return res.status(400).send({ status: false, msg: "category is require"});

    const existAuthor=await authorModel.findOne({_id:authorId})
    // console.log(existAuthor);
    // console.log(req.loggedInUser);
    if(existAuthor._id.toString() !== req.loggedInUser ){
        return res.status(401).send({status:false,msg:"Permission is denied for this user"})
    }else{
        if (isPublished === true) {
            blog["publishedAt"] = new Date();
          }
        const createBlog=await blogModel.create(blog);
        res.status(201).send({status:true,data:createBlog})
    }
   } catch (error) {
    res.status(500).send({status:false,msg:error.message})
    
   }
}


const getBlogs=async function(req,res){
    try {
        const obj={isPublished:true,isDeleted:false}
        const { authorId, category, tags, subcategory: subcategory } = req.query;
        if (authorId) {
            obj.authorId = authorId;
        }
        if (category) {
            obj.category = category;
        }
        if (tags) {
            obj.tags = { $in: [tags] };
        }
        if (subcategory) {
            obj.subcategory = { $in: [subcategory] };
        }
        let savedData = await blogModel.find(obj);
        if (savedData.length == 0) {
            return res.status(404).send({ status: false, msg: "no document found" });
        }
        return res.status(200).send({ status: true, data: savedData });
        
    } catch (error) {
        res.status(500).send({status:false,msg:error.message})
        
    }
}

const updateBlog=async function(req,res){
   try {
    const inputId=req.params.blogId
    const valid=mongoose.Types.ObjectId.isValid(inputId)
    if (!valid) return res.status(400).send({ msg: "enter valid objectID" });
    const data=req.body
    const {title,body,subcategory,tags}=data
    if(Object.keys(data).length===0){
        return res.status(400).send({status:false,msg:"Please provide valid details"})
    }
    console.log(data);
    const date = Date.now().toString();
    const alert = await blogModel.findOne({ _id: inputId, isDeleted: true });
    if (alert) {
      return res.status(404).send({status:false, msg: "this blog is already deleted" });
    }

    const blogs = await blogModel.findOneAndUpdate(
      { _id: inputId },
      {
        $set: {
          title: title,
          body: body,
          isPublished: true,
          publishedAt: date,
        },
        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );
    if (!blogs){
      return res.status(404).send({status:false, msg: "This blog dose not exist" });

    }
    res.status(200).send({status:true, data: blogs });
   } catch (error) {
    res.status(500).send({status:false,msg:error.message})
   }
}

const deleteBlog=async function(req,res){
  try {
    const inputId=req.params.blogId
    const valid=mongoose.Types.ObjectId.isValid(inputId)
    if (!valid) return res.status(400).send({ msg: "enter valid objectID" });
    const date=Date.now().toString();
    const alert=await blogModel.findOne({_id:inputId,isDeleted:true})
    if(alert){
      return res.status(404).send({status:false,msg:"This blog is already deleted"})
    }
    const updateData=await blogModel.findOneAndUpdate(
      {_id:inputId},
      {$set:{isDeleted:true,deletedAt:date}},
      {new:true}
      )
    if (!updateData){
      return res.status(404).send({status:false, msg: "This document does not exist" });

    }
    res.status(200).send({status:true,data:updateData})
  } catch (error) {
    res.status(500).send({status:false,msg:error.message})
  }
}

const deleteByQuery=async function(req,res){
  try{
    const { category, authorId, tags, subcategory, isPublished } = req.query;
    const deleteData = await blogModel.updateMany(
      {
        isDeleted: false,
        $or: [
          { authorId: authorId },
          { isPublished: isPublished },
          { tags: tags },
          { category: category },
          { subcategory: subcategory },
        ],
      },
      { $set: { isDeleted: true }, deletedAt: Date.now() },
      { new: true }
    );
    if (deleteData.modifiedCount == 0) {
      return res.status(404).send({ status: false, msg: "All documents are already deleted" });
    }
    return res.status(200).send({status: true,msg: "Now, following blogs are deleted",data: deleteData});
  }catch(error){
    res.status(500).send({status:false,msg:error.message})
  }
}



module.exports.createBlog=createBlog;
module.exports.getBlogs=getBlogs;
module.exports.updateBlog=updateBlog;
module.exports.deleteBlog=deleteBlog;
module.exports.deleteByQuery=deleteByQuery;




