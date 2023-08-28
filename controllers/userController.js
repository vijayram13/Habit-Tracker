const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const userModel = require('../models/userSchema')

// home page
module.exports.home = (req, res) =>{
  return res.redirect('/HabitTracker/login')
}

// login page
module.exports.login = async (req, res) => {
  try {
    // check if user is already logged in
    if (req.isAuthenticated()) {
      return res.redirect(`/HabitTracker/habits/${req.user.id}`);
    }
    // redirect to login page
    return res.render('login-page');


  } catch (error) {
    return res.send(error);

  }
};

// login form submission
module.exports.loginForm = async (req, res) => {
  // check if user is already logged in
  if (!req.user) {
    // redirect to login page
    return res.redirect('back');
  }
  else {
    // check user password
    const isMatch = bcrypt.compareSync(req.body.password, req.user.password)
    if (isMatch) {
      // redirect to dashboard page
      return res.redirect(`/HabitTracker/habits/${req.user.id}`);

    }
    // for worng password
    else {
      // redirect to login page
      return res.redirect('back');
    }
  }

}

// login page
module.exports.signup = async (req, res) => {
  try {
    // check if user is logged in 
    if (req.isAuthenticated()) {
      return res.redirect(`/HabitTracker/habits/${req.user.id}`);
    }
    // render signup page
    return res.render('signup-page');


  } catch (error) {
    return res.send(error);

  }
};



// create a new user
module.exports.createUser = async (req, res) => {
  try {
    // check if user is logged in
    if (req.isAuthenticated()) {
      return res.redirect(`/HabitTracker/habits/${req.user.id}`);
    }
    // signup form data
    const { name, email, password, confirm_password } = req.body;

    // find the user in the database
    const user = await userModel.findOne({ email: email })

    // user is already in the database
    if (user) {
      return res.redirect('/HabitTracker/login');
    }
    // create a new user
    else {
      // compare the password and confirm password
      if (confirm_password === password) {
        // encrypt the password
        const hash = await bcrypt.hash(password, 10);

        // newUser object
        const userObj = {
          name: name,
          email: email,
          password: hash
        }
        // create new user
        const newUser = await userModel.create(userObj);
        // redirect to login page
        return res.redirect('/HabitTracker/login');

      }
      return res.redirect('back');
    }


  } catch (error) {
    
    res.status(500).json({ error: 'Failed to add user.' });
  }

};


//SignOut 
module.exports.signout = function (req, res) {
  req.logout((err) => {
    if (err) {
      return console.log(err);
    }
    return res.redirect('/HabitTracker/login');
  });

}