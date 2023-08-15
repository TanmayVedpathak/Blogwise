require("dotenv").config();
const express = require("express");
const session = require("express-session");
const Mongostore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postsRoutes = require("./routes/posts/posts");
const commentsRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalErrHandler");

require("./config/dbConnect");

const app = express();

// 1. middlewares

// pass incoming data
app.use(express.json());

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

// users route
app.use("/api/v1/users", userRoutes);

// posts route
app.use("/api/v1/posts", postsRoutes);

// comments route
app.use("/api/v1/comments", commentsRoutes);

// 3. error handling middleware
app.use(globalErrHandler);

// 4. listen server
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is up and running at port ${PORT}`);
});
