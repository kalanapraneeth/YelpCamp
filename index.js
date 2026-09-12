const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./utils/schemas");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const ExpressError = require("./utils/ExpressError");

async function startServer() {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("Mongo Connection Open!");

    app.listen(3000, () => {
      console.log("Serving On Port 3000");
    });
  } catch (error) {
    console.log("Mongo Error");
    console.log(error);
  }
}

startServer();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "ThisShouldBeABetterSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(flash());

/// FLASH MIDDLEWARE for Flash Messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

///Router Routes

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

//

app.get("/", (req, res) => {
  res.render("home");
});

app.all("/{*path}", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND", 404));
});

app.use((err, req, res, next) => {
  let { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  return res.status(statusCode).render("error", { err });
});
