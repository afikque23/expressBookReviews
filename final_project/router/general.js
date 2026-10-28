const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 - Get the book list available in the shop (using Promise callback)
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Books not found"));
    }
  })
    .then(result => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch(err => res.status(500).json({ message: err.message }));
});

// Task 2 - Get all books using async/await with Axios
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 1 - Get book details based on ISBN (using Promise callback)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err.message }));
});

// Task 3 - Get book details based on ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 1 - Get book details based on author (using Promise callback)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const result = [];
    Object.keys(books).forEach(key => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        result.push({ isbn: key, ...books[key] });
      }
    });
    if (result.length > 0) {
      resolve(result);
    } else {
      reject(new Error("No books found for this author"));
    }
  })
    .then(bookList => res.status(200).json({ books: bookList }))
    .catch(err => res.status(404).json({ message: err.message }));
});

// Task 4 - Get all books based on author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 1 - Get all books based on title (using Promise callback)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const result = [];
    Object.keys(books).forEach(key => {
      if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
        result.push({ isbn: key, ...books[key] });
      }
    });
    if (result.length > 0) {
      resolve(result);
    } else {
      reject(new Error("No books found with this title"));
    }
  })
    .then(bookList => res.status(200).json({ books: bookList }))
    .catch(err => res.status(404).json({ message: err.message }));
});

// Task 5 - Get all books based on title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
