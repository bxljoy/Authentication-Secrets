
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const url1 = "mongodb+srv://";
const url2 = "@cluster0.djq235y.mongodb.net/";
const url3 = "?retryWrites=true&w=majority";
const userPassword = process.env.MONGODB_ATLAS_USER + ":" + process.env.MONGODB_ATLAS_PASSWORD;
const mongodbName = process.env.MONGODB_NAME;
const url = url1 + userPassword + url2 + mongodbName + url3;
mongoose.connect(url);

const userSchema = mongoose.Schema({});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout", (req, res) => {
    res.render("home");
});

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }  
});

// app.post("/register", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     User.register({username: username}, password, function(err, user) {
//         if (err) {
//             console.log(err);
//             res.render("/register");
//         } else {
//             passport.authenticate("local")(req, res, function() {
//                 res.redirect("/secrets");
//             });
//         }
//       });
// });

// app.post("/login", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const user = new User({
//         username: username,
//         password: password
//     });   

//     req.login(user, function(err) {
//         if (err) {
//             console.log(err);
//         } else {
//             passport.authenticate("local")(req, res, function() {
//                 res.redirect("/secrets");
//             });
//         }
//     });
// });

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.register({username: username}, password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            res.redirect("/secrets");
        }
      });
});

// app.post("/login", passport.authenticate('local', {
//     successRedirect: "/secrets",
//     failureRedirect: "/login",
// }));

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/secrets');
  });

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});