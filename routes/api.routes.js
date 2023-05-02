const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Usermodel } = require("../models/user.model");
const { Postmodel } = require("../models/post.model");
const authentication = require("../middlewares/authentication.middleware");

const apiRouter = express.Router();

// ------------------------------Checking Router------------------------------->

apiRouter.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: `Router is working` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//---------------------Check Date------------------------------>
apiRouter.get("/date", async (req, res) => {
  try {
    let x = new Date();
    res.status(200).send({ date: x });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
// ----------------------------------------User Section----------------------------->
//-------------------------User Register-------------->
apiRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, dob, bio } = req.body;
    if (!name || !email || !password || !dob || !bio) {
      res.status(400).send({ msg: `Please fill all the Details` });
    }
    const user = await Usermodel.findOne({ email });
    if (user) {
      res.status(400).send({ msg: `User already exists please try to login` });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          console.log(err);
          res.status(400).send({ error: err.message });
        }
        if (hash) {
          const new_user = new Usermodel({
            name,
            email,
            password: hash,
            dob,
            bio,
          });
          await new_user.save();
          res.status(201).send("User register Successfully");
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//----------------------User login----------------------->
apiRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usermodel.findOne({ email });
    const hash_pass = user.password;
    console.log(hash_pass);
    if (!user) {
      res
        .status(400)
        .send({ msg: `User does not exists please register first` });
    } else {
      bcrypt.compare(password, hash_pass, async (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send({ error: err.message });
        }

        if (result) {
          const token = jwt.sign({ userid: user._id }, "sitansu");
          res
            .status(200)
            .send({ msg: `User Logged in successfully`, token: token });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
// ---------------------------All Users------------------->
apiRouter.get("/users", async (req, res) => {
  try {
    const users = await Usermodel.find();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//-------------------All Friends of a particulat user---------->
apiRouter.get("/users/:id/friends", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Usermodel.findById(id);
    if (user) {
      const friends = user.friends;
      if (friends.length > 0) {
        res.status(200).send(friends);
      } else {
        res.status(400).send({ msg: `User have no friends` });
      }
    } else {
      res.status(400).send({ msg: `User does not exists` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//--------------User can Send a Friend Request to another User---------->
apiRouter.post("/users/:id/friends", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const an_user_id = req.body.another;
    if (id == an_user_id) {
      res.status(400).send({ msg: `cant send friend request to himself` });
    } else {
      const user = await Usermodel.findById(id);
      if (user) {
        if (user.friendRequests.includes(an_user_id)) {
          return res
            .status(400)
            .send({ msg: `You already send him friend request` });
        } else if (user.friends.includes(an_user_id)) {
          return res.status(400).send({ msg: `You both are already Friends` });
        }
        user.friendRequests.push(an_user_id);
        await user.save();
        return res
          .status(201)
          .send({ msg: "User successfully send the friend request" });
      }
    }
    // res.send(id);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//--------------User can Accept or reject friend req-------------->
apiRouter.patch("/users/:id/friends/:friendId", async (req, res) => {
  try {
    const userid = req.params.id;
    const friendId = req.params.friendId;

    const user = await Usermodel.findById(userid);
    if (!user) {
      return res.status(400).send({ msg: `User does not Exists` });
    } else {
      if (user.friendRequests.includes(friendId)) {
        const i = user.friendRequests.indexOf(friendId);
        user.friends.push(friendId);
        user.friendRequests.splice(i, 1);
        await user.save();
        res.send({ msg: "friend request accepted" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//-----------------------------------------Post Section------------------------------>
//-----------------All posts------------->
apiRouter.get("/posts", async (req, res) => {
  try {
    const posts = await Postmodel.find();
    if (posts.length > 0) {
      res.status(200).send(posts);
    } else {
      res.status(400).send({ mag: `There are no posts` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//---------------create a new POST------------->
apiRouter.post("/posts", authentication, async (req, res) => {
  try {
    const userID = req.body.userID;
    const { text, image } = req.body;
    if (!text || !image) {
      res.status(400).send({ msg: `Please fill the details` });
    }

    const post = new Postmodel({
      user: userID,
      text,
      image,
    });
    await post.save();
    res.status(201).send({ msg: `user posted a post` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//----------------user shoud update image or text of POST-------------->
apiRouter.patch("/posts/:id", authentication, async (req, res) => {
  try {
    const payload = req.body;
    const userID = req.body.userID;

    const postID = req.params.id;
    const post = await Postmodel.findById(postID);
    if (post) {
      await Postmodel.findByIdAndUpdate({ _id: postID }, payload);

      res.status(204).send({ msg: `post updated successfully` });
    } else {
      res.status(400).send({ msg: `Post does't found` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//-----------------User can DELETE a POST------------------>
apiRouter.delete("/posts/:id", async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Postmodel.findById(postID);
    if (!post) {
      return res.status(400).send({ msg: `Post does not exists` });
    }

    await Postmodel.findByIdAndDelete({ _id: postID });
    return res.status(202).send({ msg: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//-----------------Users can like the POST-------------->
apiRouter.post("/posts/:id/like", authentication, async (req, res) => {
  try {
    const userID = req.body.userID;
    const postID = req.params.id;
    const user = req.body.user;
    const post = await Postmodel.findById(postID);
    if (!post) {
      return res.status(400).send({ msg: "Post does not exists" });
    }

    if (post.likes.includes(user)) {
      return res.status(400).send({ msg: "You already liked it" });
    } else {
      post.likes.push(user);
      await post.save();
      return res.status(201).send({ msg: `${user} liked the post` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//----------------User can Comment on Post--------------->
apiRouter.post("/posts/:id/comment", async (req, res) => {
  try {
    const { text, createdAt } = req.body;
    const id = req.body.user;
    const postID = req.params.id;
    const post = await Postmodel.findById(postID);
    if (!post) {
      return res.status(400).send({ msg: `Post does not exists` });
    }

    const comment = {
      user: id,
      text,
      createdAt,
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).send({ msg: `${id} commented successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
//---------------Return a Specific POST details----------------->
apiRouter.get("/posts/:id", async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Postmodel.findById(postID);
    if (!post) {
      return res.status(400).send({ msg: "Post does not exists" });
    }

    return res.status(200).send(post);

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});
module.exports = {
  apiRouter,
};

//---------User register Schema------------------>
// {
//     "name": "A Mandal",
//     "email": "a@gamil.com",
//     "password": "a@123",
//     "dob": "2000-05-02T06:53:39.955Z",
//     "bio": "Full stack_web Developer"
//   }

//-------------post Created Schema----------------->
// {
//     "text":"Node",
//     "image":"www.node.js"
// }

//--------------------like----------------->
// {
//     "user":"6450b59459de4fdb95caffa4"
// }

//-------------------comment------------->
// {
//     "user":"6450b59459de4fdb95caffa4",
//     "text":"Awesome",
//     "createdAt":"2023-05-02T06:53:39.955+00:00"
//    }