const express = require('express');

const booksControllers = require('../controllers/books-controller');

const router = express.Router();



// bid = BookId
router.get('/:bookId', booksControllers.getBooksById)

router.get('/user/:userId', booksControllers.getBooksByUserId);

router.post('/', booksControllers.createBooksList)

router.patch('/:bid', booksControllers.updateBooks);

router.delete('/:bid', booksControllers.deleteBooks);

module.exports = router;