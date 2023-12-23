const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const dotenv = require("dotenv");

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();
const app = express();

// App configurations and middleware setup (cors, bodyParser, etc.)
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());


mongoose.set('strictQuery', false);
const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://Sandeep1999:Sandeep3122@sandeep.nlcna.mongodb.net/BlogPost?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, {
  maxPoolSize: 15,
})
.then(() => {
  console.log("Successfully Connected To MongoDB Database.");
})
.catch((e) => {
  console.log("Not Connected To MongoDB Database. Error:", e);
});
  

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });


// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  });
  app.use(limiter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Importing controllers
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
} = require('./controllers/postController');

const {
  register,
  login,
  profile,
  logout,
} = require('./controllers/authController');

// Importing middlewares
const { validateInputs, verifyToken } = require('./middlewares/index');

// Post routes
app.post('/post', validateInputs, createPost);
app.put('/post/:id', validateInputs, verifyToken, updatePost);
app.delete('/post/:id', validateInputs, verifyToken, deletePost);
app.get('/post', getAllPosts);
app.get('/post/:id', getPostById);

// Auth routes
app.post('/register', validateInputs, register);
app.post('/login', login);
app.get('/profile', verifyToken, profile);
app.post('/logout', logout);
  

const port = process.env.PORT || 4000;
app.listen(port, console.log(`Server Started: http://localhost:${port}`));
