const { validationResult } = require("express-validator");

const User = require("../models/user");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Sama",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password');
    }catch(err){
        const error = new Error("Could not fetch all users, something went wrong");
        return next(error);
    }

    res.json({users: users.map(user => user.toObject({getters: true}))});

};



const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error("Invalid inputs passed, please check your data.");
    error.code = 422;
    throw error;
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new Error("Signing up failed, please try again.");
    return next(error);
  }

  if (existingUser) {
    const error = new Error("User exists already, please login instead");
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    bookLists: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new Error("Signup failed, please try againsss");
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new Error("Logging up failed, please try again.");
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new Error("Invalid credentials, could not log you in.");
    return next(error);
  }

  res.json({ message: "Logged In!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
