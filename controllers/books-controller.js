
let DUMMY_BOOKS = [
    {
        id: 'b1',
        creator: 'u1',
        readList: [
            { bookName: "Notes from Underground", authorName: "Fyodor Dostoevsky" },
            { bookName: "1984", authorName: "George Orwell" },
          ]
    },
    {
        id: 'b2',
        creator: 'u2',
        readList: [
            { bookName: "The Wealth of Nations", authorName: "Adam Smith" },
            { bookName: "Differential Equations", authorName: "Lonely Math Prof" },
          ]
    }
]


const getBooksById = (req, res, next) => {
  const bookId = req.params.bookId;
  const books = DUMMY_BOOKS.find((b) => {
    return b.id === bookId;
  });

  if (!books) {
    const error = new Error("Could not find books entry for the provided id.");
    error.code = 404;
    throw error;

    //this triggers the error handling special middleware (with 4 params) we have in App.js
  } else {
    res.json({ books });
  }
};


const getBooksByUserId = (req, res, next) => {
    console.log("inside get books function")
    const userId = req.params.userId;
    const books = DUMMY_BOOKS.filter(b => {
        return b.creator === userId;
    });

    if (!books || books.length === 0) {
        const error = new Error("Could not find a user for the provided id.");
        error.code = 404;
        return next(error);
    }

    res.json({books});

};

const createBooksList = (req, res, next) => {
    
    const {id, creator, readList} = req.body;
    //const id = req.body.title;
    const createdBooksList = {
        id, creator, readList
    };

    DUMMY_BOOKS.push(createdBooksList);
    res.status(201).json({books: createdBooksList});
};



const updateBooks = (req, res, next) => {
      const {readList} = req.body;
      const booksId = req.params.bid;


      const updatedBooks = DUMMY_BOOKS.find(b => b.id = booksId);
      const booksIndex = DUMMY_BOOKS.findIndex(b => b.id === booksId);
      updatedBooks.readList = readList;

      DUMMY_BOOKS[booksIndex] = updatedBooks;

      res.status(200).json({book: updatedBooks})


};

const deleteBooks = (req, res, next) => {
  const booksId = req.params.bid;
  DUMMY_BOOKS = DUMMY_BOOKS.filter(b => b.id !== booksId);
  res.status(200).json({message: 'Deleted BooksList'});
};





exports.getBooksById = getBooksById;
exports.getBooksByUserId = getBooksByUserId;
exports.createBooksList = createBooksList;
exports.updateBooks = updateBooks;
exports.deleteBooks = deleteBooks;