const express = require('express');
const dotenv = require("dotenv");   // to store secret data
const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const path = require('path');
const ejs = require('ejs');


// for static layout
const expressEjsLayouts = require('express-ejs-layouts');


// dotenv configuration
dotenv.config({path:'./config.env'});
const routes = require('./routes/route')
const app = express();
const port = process.env.PORT 

// call mongodb to connect
const db = require('./config/mongoose');
// passport-local configuration
const passportLocal = require('./config/passport-local-strategy');

//ejs setup
app.set('view engine', 'ejs');
// direct access views by views name only
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'assets')));   

// express-ejs-layouts for static layouts
app.use(expressEjsLayouts);     // express-ejs-layouts setup
app.set("layout extractStyles", true)   //export style from subfolder
app.set("layout extractScripts", true)


// to get encoded data from client side
app.use(express.urlencoded({extended: true}));

// session middleware
app.use(session({
    name:process.env.NAME, 
    secret: process.env.SECRET, 
    saveUninitialized: false, 
    resave: false,  
    cookie: {
        //validation time of cookie
        maxAge: (1000*60*60*24) // Expiration time 1 day
    },
    store: mongoStore.create(
    {
        mongoUrl:process.env.mongodb,
        ttl: 14 * 24 * 60 * 60 // = 14 days.
    },(err) =>{
        console.log("Mongoose Error: " + err);
    })
    
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.get('/', (req, res) => {
    res.redirect('/HabitTracker');
});


app.use('/HabitTracker',routes);

// server listening
app.listen(port, (err) => {
    if (err) {return console.error(err);}
    return console.log(`server is listening`)
})