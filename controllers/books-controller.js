const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const booksList = require("../models/booksList");
const User = require("../models/user");

let DUMMY_BOOKS = [
  {
    id: "b1",
    creator: "u1",
    readList: [
      { bookName: "Notes from Underground", authorName: "Fyodor Dostoevsky" },
      { bookName: "1984", authorName: "George Orwell" },
    ],
  },
  {
    id: "b2",
    creator: "u2",
    readList: [
      { bookName: "The Wealth of Nations", authorName: "Adam Smith" },
      { bookName: "Differential Equations", authorName: "Lonely Math Prof" },
    ],
  },
];

const getBooksById = async (req, res, next) => {
  const bookId = req.params.bookId;
  let books;
  try {
    books = await booksList.findById(bookId);
  } catch (err) {
    const error = new Error(
      "Something went wrong, could not find the bookList"
    );
    throw error;
  }

  if (!books) {
    const error = new Error("Could not find books entry for the provided id.");
    error.code = 404;
    throw error;

    //this triggers the error handling special middleware (with 4 params) we have in App.js
  } else {
    res.json({ books: books.toObject({ getters: true }) });
  }
};

const getBooksByUserId = async (req, res, next) => {
  console.log("inside get books function");
  const userId = req.params.userId;
  let books;
  try {
    //returns array with creator === userId
    books = await booksList.find({ creator: userId });
  } catch (err) {
    const error = new Error("Fetching booksList failed, please try again.");
    error.code = 500;
    throw error;
  }

  if (!books || books.length === 0) {
    const error = new Error("Could not find a user for the provided id.");
    error.code = 404;
    return next(error);
  }

  res.json({ books: books.map((place) => place.toObject({ getters: true })) });
};

const createBooksList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, please check your data.");
    error.code = 422;
    throw error;
  }

  const { creator, readList } = req.body;
  //const id = req.body.title;
  const createdBooksList = new booksList({
    creator: mongoose.Types.ObjectId(creator),
    readList,
  });
  console.log("NEWLY CREATED BOOKLIST IS HERE")
  console.log(createdBooksList);
  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new Error("Creating place failed, please try again.");
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error("Could not find user for provided id.");
    error.code(404);
    return next(error);
  }

  console.log(user);

  try {
    //we use sessions and transactions to ensure that both things happen, first bookList gets created and
    //second, the bookLists's id gets added to the user's bookLists array.
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBooksList.save({ session: sess });
    user.bookLists.push(createdBooksList);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new Error("Creating booksList failed, please try again.");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ books: createdBooksList });
};

const updateBooks = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, please check your data.");
    error.code = 422;
    throw error;
  }
  const { readList } = req.body;
  const booksId = req.params.bid;

  let books;
  try {
    books = await booksList.findById(booksId);
  } catch (err) {
    const error = new Error("Could not update booksList, please try again");
    throw error;
  }

  books.readList = readList;

  try {
    await books.save();
  } catch (err) {
    const error = new Error("Something went wrong, could not update place.");
    throw error;
  }

  res.status(200).json({ book: books.toObject({ getters: true }) });
};

const deleteBooks = async (req, res, next) => {
  const booksId = req.params.bid;

  let books;
  try {
    books = await booksList.findById(booksId).populate('creator');
    console.log(books)
  } catch (err) {
    const error = new Error(
      "Something went wrong, could not delete booksList."
    );
    return next(error);
  }

  if (!books) {
    const error = new Error("Could not find booksList for this id.");
    return next(error);
  }
  console.log(books.creator);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await books.remove({ session: sess });
    console.log(books.creator.name);
    books.creator.bookLists.pull(books);
    await books.creator.save({ session: sess });
    await sess.commitTransaction();


  } catch (err) {
    console.log("[INFO]: HELLO THIS IS THE ERROR")
    console.log(err);
    const error = new Error(
      "Something went wrong, could not delete booksList."
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted BooksList" });
};

exports.getBooksById = getBooksById;
exports.getBooksByUserId = getBooksByUserId;
exports.createBooksList = createBooksList;
exports.updateBooks = updateBooks;
exports.deleteBooks = deleteBooks;
