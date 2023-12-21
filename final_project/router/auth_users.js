const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{'username' : 'josh', 'password' : 'pee'}];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  filtered = users.filter((user) => {
    return user.username == username;
  });
  if (filtered.length > 0) return true;
  else return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  filtered = users.filter((user) => {
    return user.username == username && user.password == password;
  });
  if (filtered.length > 0) return true;
  else return false;
};

//only registered users can login
// hansles a n HTTP post request to the /login endpoint
regd_users.post("/login", (req, res) => {
  //Write your code here
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    // if these name and password are valid, create a JWT token and store it in the session
    let accessToken = jwt.sign({ data: password }, "access", {
      //creates a JWT using jwt.sign, this token includes the passwrd in the payload and is signed with the scerety key access

      expiresIn: 60 * 60,
    });
    // this line adds an authorization object to the session
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User logged in successfully");
  }
  return res.send("failed login");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(req.body)
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    book["reviews"][username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
