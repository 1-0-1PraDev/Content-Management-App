import express, { json } from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import UserModel from "./models/userModel.js";
import postModel from "./models/postModel.js";
import fs, { renameSync } from "fs";
import multer from "multer";
const uploadMiddleware = multer({ dest: "uploads/" });

const app = express();
const PORT = 4000 || process.env.PORT;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE 11) choke on 204
};

import path from "path";
import url from "url";
import commentModel from "./models/commentModel.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__filename);
console.log(__dirname);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

console.log(__dirname);

const secretKey = "dsflskdfl0494090a0q";
const DATABASE_URL = "mongodb://127.0.0.1:27017/article-blog";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
};

mongoose
  .connect(DATABASE_URL, options)
  .then(() => {
    console.log("Connected to Db Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '/uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const uploadMiddleware = multer({ storage });

// Check Token Middleware
const checkToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    req.user = info;
    next();
  });
};

// Routes
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // checks if the user exists
  const existedUser = await UserModel.findOne({ email });
  if (existedUser) {
    res.status(400).json({ message: "User already exists! " });
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPasswd = await bcrypt.hash(password, salt);
    const registerdUser = await UserModel.create({
      username,
      email,
      password: hashedPasswd,
    });
    res.status(200).json(registerdUser);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswdMatched = bcrypt.compareSync(password, userDoc.password);

    if (isPasswdMatched) {
      jwt.sign({ email, id: userDoc._id }, secretKey, {}, (err, token) => {
        if (err) {
          return res.status(500).json({ message: "JWT creation error" });
        }
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({ email, id: userDoc._id });
      });
    } else {
      return res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", checkToken, (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/logout", (req, res) => {
  try {
    res.cookie("token", "");
    res.status(200).json({ message: "User successfully Logged Out" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/create", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const { token } = req.cookies;
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content, category } = req.body;

      const postDoc = await postModel.create({
        title,
        summary,
        content,
        category,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const { category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = category ? { category } : {};
    const skip = (page - 1) * limit;
    const posts = await postModel
      .find(query)
      .populate("author", ["username"])
      .skip(skip)
      .limit(limit);  
    res.json(posts);

  } catch (err) {
    console.log(err);
  }
});

// Get count of posts
app.get("/posts/totalCount", async(req, res) => {
  try{
    const totalPosts = await postModel.countDocuments();
    res.json({totalPosts});
  }catch(err){  
    console.log(err);
  }
});

app.get("/post/:id", async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.params;

    // jwt.verify(token, secretKey, {}, async(err, info) => {
    //     if(err) throw err;

    // });

    const postDoc = await postModel
      .findById(id)
      .populate("author", ["username"]);
    res.json(postDoc);
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await postModel.findById(id);
    res.json(postDoc);
  } catch (err) {
    console.log(err);
  }
});

app.delete('/post/:postId', async(req, res) => {
  try{
    const { postId } = req.params;
    const postID = new mongoose.Types.ObjectId(postId);

    await postModel.deleteOne({_id: postID});
    return res.json({
      msg: "Post Deleted Successfully"
    });

  }catch(err){
    console.log(err);
  }
});

app.get('/posts/search', async(req, res) => {
  try{
    const { search } = req.query;
    const matchedPosts = await postModel.find({ title: { $regex: search, $options: 'i' } });
    if(matchedPosts.length > 0){
      return res.status(200).json(matchedPosts);
    }
  }catch(err){
    return res.status(400).json({
      msg: err.message
    });
  }
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, content, summary, category } = req.body;
      const postDoc = await postModel.findById(id);
      // console.log(postDoc.author, info.id)
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(400).json({ message: "You are not fucking author" });
      }

      await postDoc.updateOne({
        title,
        content,
        summary,
        category,
        cover: newPath ? newPath : postDoc.cover,
      });

      res.json(postDoc);
    });
  } catch (err) {
    console.log(err);
  }
});

// Comments Routes
app.post("/add-comment", async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({
          errMsg: "Logged in first to put comment",
        });
      }

      const { commentText, postId } = req.body;
      const isValidObjectId = mongoose.Types.ObjectId.isValid(postId);
      if (!isValidObjectId) {
        return res.status(400).json({ errMsg: "Invalid postId" });
      }

      const newComment = new commentModel({
        text: commentText,
        author: info.id,
        postId: new mongoose.Types.ObjectId(postId),
      });

      // save comment to database
      const savedComment = await newComment.save();

      if (mongoose.Types.ObjectId.isValid(newComment.author)) {
        const updatedPost = await postModel.findByIdAndUpdate(
          postId,
          { $push: { comments: savedComment._id } },
          { new: true }
        );

        res.json({
          msg: "Comment added sucessfully",
        });
      }
      return;
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await commentModel
      .find({ postId })
      .populate("author", "username");

    res.json(comments);
  } catch (err) {
    console.log(err);
  }
});

app.post("/posts/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({
          errMsg: "Logged in first to put comment",
        });
      }

      const userID = new mongoose.Types.ObjectId(userId);
      const postID = new mongoose.Types.ObjectId(postId);

      if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(postID)) {
        return res.status(400).json({
          errMsg: "UserId or PostId is not valid",
        });
      }
      const data = await postModel.findByIdAndUpdate(
        postID,
        { $addToSet: { likes: userID }, $set: {isLiked: true} },
        { new: true }
      );

      return res.json({
        msg: "You have liked the post",
      });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/posts/:postId/unlike", async (req, res) => {
  try{  
    const { postId } = req.params;
    const { userId } = req.body;
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({
          errMsg: "Logged in first to put comment",
        });
      }

      const userID = new mongoose.Types.ObjectId(userId);
      const postID = new mongoose.Types.ObjectId(postId);

      const data = await postModel.findByIdAndUpdate(
        postID,
        { $pull: { likes: userID }, $unset: {isLiked: false} },
        { new: true }
      );

      return res.status(200).json({
        msg: 'unliked the post'
      });
    });

  }catch(err){
    console.log(err);
  }
});

app.get(`/posts/:userId/favorite-posts`, async(req, res) => {
  try{
    const { userId } = req.params;
    const userID = new mongoose.Types.ObjectId(userId);
    const favPosts = await postModel.find({likes: userID});
    return res.status(200).json(favPosts);
  }catch(err){
    console.log(err);
  }
});

app.get(`/likedStatus/:userId`, async(req, res) => {
  const { userId } = req.params;
  try{
    const likedPosts = await postModel.find({ likes: userId });
    const isLikedArray = likedPosts.map((post) => ({[post._id] : post.isLiked}));
    res.status(200).json(isLikedArray);
  }catch(err){
    console.log(err);
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
