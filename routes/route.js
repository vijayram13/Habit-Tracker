const express = require('express');
const router = express.Router();
const passport = require('passport');

// user controller
const userController = require('../controllers/userController')

// habit controller
const habitController = require('../controllers/habitController')

// mailer controller
const mailerController = require("../controllers/mailerController");

// home controller
router.get('/',userController.home);

// send auto generate password to the user mail
router.post("/send-mail",mailerController.send);

// Login page
router.get('/login', userController.login);

// login form submission
router.post('/loginform',
    passport.authenticate('local',
    { failureRedirect: '/HabitTracker/login' }),
    userController.loginForm);

// signout
router.get('/signout', userController.signout);



// signup page
router.get('/signup', userController.signup);

// create new user
router.post('/createUser', userController.createUser);

// to show the habits of the user
router.get('/habits/:userId', habitController.habits);

// to add the habit of the user 
router.post('/:userId/add-habit', habitController.add_habit);

// to update the today's habit status
router.post('/:habitId/update/today', habitController.today_update);

// to update the status of 6-days before
router.get('/:habitId/update', habitController.status_update);


// exports the router
module.exports = router;