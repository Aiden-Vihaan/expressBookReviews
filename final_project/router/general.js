const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Helper to simulate a promise-based fetch
const getBooks = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books data not found");
        }
    });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBooks();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book list: " + error });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookList = await getBooks();
        if (bookList[isbn]) {
            return res.status(200).json(bookList[isbn]);
        } else {
            return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book by ISBN: " + error });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const bookList = await getBooks();
        const filtered_books = Object.values(bookList).filter((book) => book.author === author);
        if (filtered_books.length > 0) {
            return res.status(200).json(filtered_books);
        } else {
            return res.status(404).json({ message: "No books found for author: " + author });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author: " + error });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const bookList = await getBooks();
        const filtered_books = Object.values(bookList).filter((book) => book.title === title);
        if (filtered_books.length > 0) {
            return res.status(200).json(filtered_books);
        } else {
            return res.status(404).json({ message: "No books found with title: " + title });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title: " + error });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Reviews not found for ISBN " + isbn });
    }
});

module.exports.general = public_users;
