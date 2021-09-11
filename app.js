const express = require('express');
const bodyParser = require('body-parser');

const booksRoutes = require('./routes/books-routes');

const app = express();

app.use(bodyParser.json());

app.use( '/api/books', booksRoutes);

//special middleware to handle error
app.use((error, req, res, next) => {
    //check if response has already been sent
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occured!"});

})


app.listen(5000);
