//mongodb+srv://jagtapsupriya58:Supriya%40123@i527312cluster.vktkcio.mongodb.net/?retryWrites=true&w=majority

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { urlencoded } = require("express");
const validator = require("email-validator");

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

app.use(express.static(__dirname));
// Routes
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  const errorResponse = validateUserInput(username, password, res);
  if (errorResponse) return errorResponse;

  const isValidEmail = validator.validate(username);
  if (!isValidEmail) return send404Error(res, "Please enter a valid email");

  if (password.length < 8)
    return send404Error(res, "Password should be atleast 8 characters");

  if (!/[A-Z]/.test(password))
    return send404Error(
      res,
      "Password must contain atleast 1 uppercase alphabet"
    );

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

function send404Error(res, message) {
  return res.status(404).send({ data: message });
}

function validateUserInput(username, password, res) {
  if (!username && !password)
    return send404Error(res, "Please provide username and password");

  if (!username) return send404Error(res, "Please provide the username");

  if (username.length > 40)
    return send404Error(
      res,
      "Username/Email should not be more than 40 characters"
    );

  if (!password) return send404Error(res, "Please provide the password");

  if (/\s/.test(username))
    return send404Error(res, "Username cannot include spaces");

  const isValidEmail = validator.validate(username);
  if (!isValidEmail) return send404Error(res, "Please enter a valid email");
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const errorResponse = validateUserInput(username, password, res);
    if (errorResponse) return errorResponse;

    const userFromUsername = await User.find({ username });
    if (!userFromUsername.length)
      return send404Error(
        res,
        `Could not find a user with username: ${username}`
      );

    const userWithUserPass = userFromUsername.find(
      (u) => u.password === password
    );
    if (userWithUserPass) {
      return res.status(200).send("Login successful");
    } else {
      return res.status(401).send({ data: "Incorrect password" });
    }
  } catch (error) {
    console.error("Failed to login", error);
    return res.status(500).send("Failed to login");
  }
});

app.post("/delete", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const userWithUserPass = await User.deleteOne({ username, password });

    if (userWithUserPass) {
      res.status(204).send("Delete successful");
    }
  } catch (error) {
    console.error("Failed to login", err);
    res.status(500).send("Failed to login");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
