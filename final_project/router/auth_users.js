const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


// ✅ Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};


// ✅ Check username & password match
const authenticatedUser = (username, password) => {
  return users.some(user => 
    user.username === username && user.password === password
  );
};


// ✅ Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "Login successful" });

  } else {
    return res.status(403).json({ message: "Invalid credentials" });
  }
});


// ✅ Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: `Review added/updated for ISBN ${isbn}`
    });
  }

  return res.status(404).json({ message: "Book not found" });
});


// ✅ DELETE review (THIS IS IMPORTANT FOR Q10)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: `Review for ISBN ${isbn} deleted`
    });
  }

  return res.status(404).json({ message: "Review not found" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
