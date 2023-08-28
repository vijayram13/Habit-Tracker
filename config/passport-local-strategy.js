const express = require("express");
const passport = require('passport');
const bcrypt = require('bcrypt');
// db model call
const userModel = require('../models/userSchema');

// local Strategy call rom passportjs
const LocalStrategy = require('passport-local').Strategy;

// Authentication using passport
passport.use(new LocalStrategy(
    { 
        usernameField: 'email',
        passReqToCallback: true   
    },
    
    async(req,email, password,done) => {
        try {
            
            // find the user in the database
            const user = await userModel.findOne({ email: email });
            
            //user exists in the database or not
            if (user == null) {
                return done(null, false);
            }
            // check user password
            const isMatch = bcrypt.compareSync(password,user.password);

            // check user is authenticated or not
            if(user && isMatch) {
                // console.log(user);
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }

    }));


//Serializing the user_id
passport.serializeUser(function (user, done) {
    // Store only the unique identifier of the user in the session
    done(null, user.id);
});

//deserializing the user
passport.deserializeUser(function (id, done) {
    // Retrieve the user object based on the serialized data
    userModel.findById(id)
        .then((user, err) => {
            done(err, user);
        })

});



//check if the user is  authenticated 
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // redirect to login page if user is not authenticated
    return res.redirect('back');
};

// set the user to locals
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // store user in locals to use it views or anywhere
        res.locals.user = req.user;
    }
    return next();
};
// export the passport
module.exports = passport;
