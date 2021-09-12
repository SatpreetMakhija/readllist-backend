let DUMMY_USERS = [
    {
        id: 'u1',
        name: "Sama",
        email: "test@test.com",
        password: "testers"
    }
]


const express = require('express');

const usersControllers = require('../controllers/users-controllers.js');


const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/signup', usersControllers.signup);

router.post('/login', usersControllers.login );

module.exports = router;



