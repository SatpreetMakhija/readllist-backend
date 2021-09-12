const mongoose = require('mongoose');
const uniqueValidtor = require('mongoose-unique-validator');
//library to check that email does not exist already. 

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    bookLists: [{type: mongoose.Types.ObjectId, required: true, ref: 'bookList'}],
    //bookLists will contain the ids of bookLists the user has created.
    //the array indicates that there can be multiple bookLists created by a 
    //single user.
});

userSchema.plugin(uniqueValidtor);

module.exports = mongoose.model('User', userSchema);

