//mongodb+srv://jagtapsupriya58:Supriya%40123@i527312cluster.vktkcio.mongodb.net/?retryWrites=true&w=majority

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { urlencoded } = require("express");

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: true }));
app.use(express.json());
app.use(urlencoded());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://jagtapsupriya58:Supriya%40123@i527312cluster.vktkcio.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const User = mongoose.model("User", {
  username: String,
  password: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  // Create a new user
  const newUser = new User({ username, password });

  // Save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).send("User registered successfully");
    })
    .catch((err) => {
      console.error("Failed to register user", err);
      res.status(500).send("Failed to register user");
    });
});

app.get("/register", (req, res) => {
  return res.send("Working");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  // Find the user in the database
  User.findOne({ username, password })
    .then((user) => {
      if (user) {
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid username or password");
      }
    })
    .catch((err) => {
      console.error("Failed to login", err);
      res.status(500).send("Failed to login");
    });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
