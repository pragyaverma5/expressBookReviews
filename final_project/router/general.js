const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ================= REGISTER ================= */
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password required"});
  }

  if (isValid(username)) {
    users.push({username: username, password: password});
    return res.status(200).json({message: "User successfully registered"});
  } else {
    return res.status(404).json({message: "User already exists"});
  }
});


/* ================= GET ALL BOOKS ================= */
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});


/* ================= GET BY ISBN (Using Axios) ================= */
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    const data = response.data;

    if (data[isbn]) {
      return res.status(200).json({[isbn]: data[isbn]});
    } else {
      return res.status(404).json({message: "Book not found"});
    }

  } catch (error) {
    return res.status(500).json({message: "Error retrieving book"});
  }
});


/* ================= GET BY AUTHOR (Using Axios) ================= */
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    const data = response.data;

    let filtered = {};

    for (let key in data) {
      if (data[key].author.toLowerCase() === author.toLowerCase()) {
        filtered[key] = data[key];
      }
    }

    if (Object.keys(filtered).length > 0) {
      return res.status(200).json(filtered);
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }

  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});


/* ================= GET BY TITLE (Using Axios) ================= */
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    const data = response.data;

    let filtered = {};

    for (let key in data) {
      if (data[key].title.toLowerCase() === title.toLowerCase()) {
        filtered[key] = data[key];
      }
    }

    if (Object.keys(filtered).length > 0) {
      return res.status(200).json(filtered);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }

  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});


/* ================= GET REVIEW ================= */
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
