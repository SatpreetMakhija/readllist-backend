
let DUMMY_USERS = [
    {
        id: 'u1',
        name: "Sama",
        email: "test@test.com",
        password: "testers"
    }
]




const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const {name, email, password} = req.body;



    const userAlreadyExists = DUMMY_USERS.find(u => u.email === email)
    if (userAlreadyExists) {
        const error = new Error("Could not create user, email already exists");
        error.code = 422;
        throw error;
    }

    const createdUser = {
        name, email, password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser});

};

const login = (req, res, next) => {
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    if (!identifiedUser || !identifiedUser.password === password) {
        const error = new Error("Could not find books entry for the provided id.");
        error.code = 404;
        throw error;
    };

    res.json({message: "Logged In!"}); 


};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
