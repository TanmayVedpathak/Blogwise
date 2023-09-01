require("dotenv").config();
const express = require("express");
const session = require("express-session");
const Mongostore = require("connect-mongo");
const methodOverride = require("method-override");
const userRoutes = require("./routes/users/users");
const postsRoutes = require("./routes/posts/posts");
const commentsRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalErrHandler");

require("./config/dbConnect");

const app = express();

// 1. middlewares

// configure ejs
app.set("view engine", "ejs");

// serve statics file
app.use(express.static(__dirname + "/public"));

// pass incoming data
app.use(express.json());

// pass incoming data from form
app.use(express.urlencoded({ extended: true }));

// method override
app.use(methodOverride("_method"));

// session config
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new Mongostore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 1day
    }),
  })
);

// save the login user into locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

// users route
app.use("/api/v1/users", userRoutes);

// posts route
app.use("/api/v1/posts", postsRoutes);

// comments route
app.use("/api/v1/comments", commentsRoutes);

// 2. routes
app.get("/", (req, res) => {
  res.render("index");
});

// 3. error handling middleware
app.use(globalErrHandler);

// 4. listen server
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is up and running at port ${PORT}`);
});
