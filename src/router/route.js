const express = require("express");
const { createAuthor, authorLogin, getAllAuthor } = require("../controllers/authorController");
const { createBlog, getBlogs, updateBlog, deleteBlog, deleteByQuery } = require("../controllers/blogController");
const { authenticate, authorization, authorize } = require("../middleware/auth");
const router = express.Router();

router.get("/test-me", (req, res) => {
  res.send("My First Ever API");
});

router.post('/authors',createAuthor)
router.post('/login',authorLogin)
router.get("/getauthors",getAllAuthor)
router.post("/blogs",authenticate,createBlog)
router.get("/blogs",authenticate,getBlogs)
router.put("/blogs/:blogId",authorization,updateBlog)
router.delete("/blogs/:blogId",authenticate,deleteBlog)
router.delete("/blogs",authenticate,authorize,deleteByQuery)

router.all("/*", function (req, res) {
  res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"})
})

module.exports = router;

