const express = require("express");
const { createAuthor, authorLogin, getAllAuthor } = require("../controllers/authorController");
const { createBlog, getBlogs, updateBlog } = require("../controllers/blogController");
const router = express.Router();

router.get("/test-me", (req, res) => {
  res.send("My First Ever API");
});

router.post('/authors',createAuthor)
router.post('/login',authorLogin)
router.get("/getauthors",getAllAuthor)
router.post("/blogs",createBlog)
router.get("/blogs",getBlogs)
router.put("/blogs/:blogId",updateBlog)

router.all("/*", function (req, res) {
  res.status(400).send({status: false, message: "Make Sure Your Endpoint is Correct !!!"})
})

module.exports = router;

