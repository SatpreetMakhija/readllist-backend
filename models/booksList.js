const mongoose = require('mongoose');
//schema is a blueprint of a document that will get added to a collection
const Schema = mongoose.Schema;

const booksListSchema = new Schema({

    creator: {type: String, required: true},
    readList: {
        type: Array
    }
})

//model creates the collection later;
module.exports = mongoose.model('booksList', booksListSchema);


