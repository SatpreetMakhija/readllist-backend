const express = require('express');

const {check, body} = require('express-validator');


const booksControllers = require('../controllers/books-controller');

const router = express.Router();



// bid = BookId
router.get('/:bookId', booksControllers.getBooksById)

router.get('/user/:userId', booksControllers.getBooksByUserId);

router.post('/', [check('creator').not().isEmpty(), 
body('readList').custom((bookList, {req}) => {
    for (var i =0; i< bookList.length; i++) {
        console.log(bookList[i].bookName)
        console.log(bookList[i].authorName);
        if (bookList[i].bookName === "" || bookList[i].authorName === "") {
            throw new Error('please check your data. !')
        }
    }

    return true;
})

], booksControllers.createBooksList)

router.patch('/:bid', body('readList').custom((bookList, {req}) => {
    
    for (var i =0; i< bookList.length; i++) {
      
        if (bookList[i].bookName === "" || bookList[i].authorName === "") {
            throw new Error('please check your data. !')
        }
    }

    return true;
}), 
 booksControllers.updateBooks);

router.delete('/:bid', booksControllers.deleteBooks);

module.exports = router;