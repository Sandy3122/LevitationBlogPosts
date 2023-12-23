const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// Post Creation
const createPost = async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
  
      const { title, summary, content, imageUrl } = req.body;
  
      try {
        const postDoc = await Post.create({
          title,
          summary,
          content,
          imageUrl,
          author: info.id,
        });
        res.json(postDoc);
      } catch (error) {
        console.error('Error creating post:', error);
        sendError(res, 500, 'Failed to create post');
      }
    });
};

// Update Post
const updatePost = async (req, res) => {
    const { id } = req.params; // Get the post ID from the request parameters

    const { title, summary, content, imageUrl } = req.body;
  
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
  
      try {
        const postDoc = await Post.findById(id);
        if (!postDoc) {
          return res.status(404).json({ error: 'Post not found' });
        }
  
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(400).json({ error: 'You are not the author' });
        }
  
        // Update the post document with new values
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.imageUrl = imageUrl; // Update imageUrl field
  
        await postDoc.save(); // Save the updated post document
  
        res.json(postDoc); // Respond with the updated post document
      } catch (error) {
        console.error('Error updating post:', error);
        sendError(res, 500, 'Failed to update post');
      }
    });
};

// Delete Post
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
      const { token } = req.cookies;
      const info = await jwt.verify(token, secret);
  
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json({ error: 'You are not the author' });
      }
  
      // If the user is the author, delete the post
      await Post.deleteOne({ _id: id });
  
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
};

// Get All Posts
const getAllPosts = async (req, res) => {
    res.json(
        await Post.find()
          .populate('author', ['username'])
          .sort({createdAt: -1})
          .limit(20)
      );
};

// Get Post By Id
const getPostById = async (req, res) => {
    const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
};

module.exports = { createPost, updatePost, deletePost, getAllPosts, getPostById };
