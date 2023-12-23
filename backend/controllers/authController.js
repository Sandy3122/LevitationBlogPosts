const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv  = require("dotenv");

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
dotenv.config()

//Register Route
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Registration failed");
  }
};

//Login Route
const login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) return res.status(404).json({ message: "User not found" });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(400).json({ message: "Wrong credentials" });

  const token = jwt.sign({ username, id: userDoc._id }, secret, {
    expiresIn: "1h",
  });
  res
    .cookie("token", token, { httpOnly: true })
    .json({ id: userDoc._id, username });
};

// Profiles Route
const profile = async (req, res) => {
  const { user } = req;
  try {
    const userPosts = await Post.find({ author: user.id })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ username: user.username, id: user.id, posts: userPosts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};

// Logout Route
const logout = async (req, res) => {
    const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  res.clearCookie('token').json({ message: 'Logged Out Successfully' });
};

module.exports = { register, login, profile, logout };
