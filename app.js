
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const url1 = "mongodb+srv://";
const url2 = "@cluster0.djq235y.mongodb.net/";
const url3 = "?retryWrites=true&w=majority";
const userPassword = process.env.MONGODB_ATLAS_USER + ":" + process.env.MONGODB_ATLAS_PASSWORD;
const mongodbName = process.env.MONGODB_NAME;
const url = url1 + userPassword + url2 + mongodbName + url3;
mongoose.connect(url);

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

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

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds).then(hash => {
        const newUser = new User({
            email: username,
            password: hash
        });
    
        newUser.save().then(success => {
            res.render("secrets");
        }, failure => console.log(failure));
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(success => {
        if (success) {
            bcrypt.compare(password, success.password).then(result => {
                if (result) {
                    res.render("secrets");
                } else {
                    console.log("password is invalid!");
                }
            });   
        } else {
            console.log("No such a username!");
        }
    }, failure => console.log(failure));
});


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});