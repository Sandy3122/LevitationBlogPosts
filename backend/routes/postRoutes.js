const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares');
const { createPost, updatePost, deletePost, getAllPosts, getPostById } = require('../controllers/postController');
const { validateInputs } = require('../middlewares/index');

router.use(verifyToken);
router.post('/post', createPost);
router.put('/post/:id', updatePost);
router.delete('/post/:id', deletePost);
router.get('/post', getAllPosts);
router.get('/post/:id', getPostById);

module.exports = router;
