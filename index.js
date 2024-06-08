const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require("./models/todo");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Define the port number
const port = process.env.PORT || 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection URI
const dburl = process.env.MONGO_URI || "mongodb://localhost:27017/tododb";

// Connect to MongoDB
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Define routes
app.get("/", (req, res) => {
  Todo.find()
    .then(result => {
      res.render("index", { data: result });
    })
    .catch(err => {
      res.status(500).send('Error retrieving todos');
    });
});

app.post("/", (req, res) => {
  const todo = new Todo({
    todo: req.body.todoValue
  });
  todo.save()
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(500).send('Error saving todo');
    });
});

app.delete("/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json({ redirect: "/" });
    })
    .catch(err => {
      res.status(500).send('Error deleting todo');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
