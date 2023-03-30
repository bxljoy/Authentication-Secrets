
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

/* ------------ Use the crypto module to generate encKey and sigKey --------------  */
// const crypto = require('crypto');

// const generateKey = (bytes) => {
//   return crypto.randomBytes(bytes).toString('base64');
// };

// const encKey = generateKey(32);
// const sigKey = generateKey(64);

// console.log(encKey);
// console.log(sigKey);

/*--------- Use dotenv module to save and access environment values ------------*/

const encKey = process.env.ENCRYPTION_KEY;
const sigKey = process.env.SIGNING_KEY;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://bxljoy:198538Bl@cluster0.djq235y.mongodb.net/userDB?retryWrites=true&w=majority");

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {
    encryptionKey: encKey,
    signingKey: sigKey,
    encryptedFields: ["password"]
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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(success => {
        res.render("secrets");
    }, failure => console.log(failure));
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(success => {
        if (success) {
            if (success.password === password) {
                res.render("secrets");
            } else {
                console.log("password is invalid!");
            }    
        } else {
            console.log("No such a user!");
        }
    }, failure => console.log(failure));
});


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});