const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerdUser = await User.register(user, password);
    req.flash("success", "Welcome To YelpCamp");
    res.redirect("/campgrounds");
  } catch (e) {
    if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
      req.flash("error", "A user with the given email is already registered!");
      return res.redirect("/register");
    }

    req.flash("error", e.message);
    res.redirect("/register");
  }
});

module.exports = router;
