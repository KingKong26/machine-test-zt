var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("hello");
  res.send("respond with a resource");
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      try {
        // generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // create user object
        const newUser = await new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });
        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
      } catch (err) {
        console.log(err);
      }
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !validPassword
        ? res.status(400).json("Wrong Password")
        : res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// add
router.post("/add", async function (req, res, next) {
  try {
    const user = await User.findById(req.body.userId);
    if (req.body.expense) {
      console.log(req.body.expense, "expense");
      await user.updateOne({ $push: { expense: req.body.expense } });
      res.status(200).json("Added");
    } else {
      await user.updateOne({ $push: { income: req.body.income } });
      res.status(200).json("Added");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

// get
router.get("/:userId", async (req, res) => {
  console.log("hello",req.params)
  try {
    const currentUser = await User.findById(req.params.userId);
    console.log(currentUser);
    res.status(200).json(currentUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// clear
router.post("/clear", async (req, res) => {
  console.log("hello",req.body)

  try {
    const user = await User.findById(req.body.userId);
    await user.updateOne({ $set: { income: [] } });
    await user.updateOne({ $set: { expense: [] } });
    res.status(200).json("Added");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

module.exports = router;
