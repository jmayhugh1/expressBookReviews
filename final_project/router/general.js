const express = require("express");
let books = require("./booksdb.js");
const {
  get,
} = require("../../../nodejs_PracticeProject_AuthUserMgmt/router/friends.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let ans = [];
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "author" && book[i][1] == req.params.author) {
        ans.push(books[key]);
      }
    }
  }
  if (ans.length == 0) {
    return res.status(300).json({ message: "Author not found" });
  }
  res.send(ans);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let ans = [];
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "title" && book[i][1] == req.params.title) {
        ans.push(books[key]);
      }
    }
  }
  if (ans.length == 0) {
    return res.status(300).json({ message: "Title not found" });
  }
  res.send(ans);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

//task 10

const getAllBooks = async () => {
  const response = await axios.get("http://localhost:5000/");
  console.log(response.data);
  return response.data;
};

public_users.get("/async", async (req, res) => {
  try {
    const books = await getAllBooks();
    res.send(books);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// task 11 using async-await with axios
const getAllBookByISBN = async (isbn) => {
  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  return response.data;
};
public_users.get("/async/isbn/:isbn", async (req, res) => {
  try {
    const book = await getAllBookByISBN(req.params.isbn);
    res.send(book);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//task`12 getting book details based on author
const getAllBookByAuthor = async (author) => {
  const response = await axios.get(`http://localhost:5000/author/${author}`);
  return response.data;
};
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const book = await getAllBookByAuthor(req.params.author);
    res.send(book);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//task 13 getting book details based on title
const getBooksByTitle = async (title) => {
  const response = await axios.get(`http://localhost:5000/title/${title}`);
  return response.data;
};

public_users.get("/async/title/:title", async (req, res) => {
  try {
    const book = await getBooksByTitle(req.params.title);
    res.send(book);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
module.exports.general = public_users;
