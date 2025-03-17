var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'authTest'
});

connection.connect(function(err) {
    if(err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

const initPassport = require('./passport-config');
initPassport(
    passport, 
    connection
);

const users = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: generateSecret(),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.get('/', checkAuthenticated, function(req, res) {
    console.log(req.user.username);
    res.render('index.ejs', { username: req.user.username });
});

app.get('/login', checkNotAuthenticated, function(req, res) {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, function(req, res) {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username exists
        connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, usernameResults) => {
            if (err) {
                console.error(err);
                return res.redirect('/register');
            }

            if (usernameResults.length > 0) {
                req.flash('error', 'Username already exists');
                return res.redirect('/register');
            }

            // Check if email exists
            connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, emailResults) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/register');
                }

                if (emailResults.length > 0) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('/register');
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/register');
                    }

                    res.redirect('/login');
                });
            });
        });

    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});

app.delete('/logout', function(req, res, next) {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
    });
    res.redirect('/login');
});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    next();
}

function generateSecret() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let generated = '';
    for (let i = 0; i < 20; i++) {
        generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return generated;
}

app.listen(3000, function() {
  console.log('http://localhost:3000');
});