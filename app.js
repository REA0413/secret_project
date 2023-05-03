//jshint esversion:6
require('dotenv').config()
// console.log(process.env.S3_BUCKET)

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
var encrypt = require('mongoose-encryption');

const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true});
}

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const userSchema = new mongoose.Schema({

    email: {
      type: String,
      required: [true, "Please double check your data entry, no title specified"]
      },
    password: {
      type: String,
      required: [true, "Please double check your data entry, no content specified"]
      }
});

// const secret = "Rahasialohya"
userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);

app.get("/", function(req,res){
    res.render("home");
})

app.get("/login", function(req,res){
    res.render("login");
})

app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
        
    })
    newUser.save()
    .then(() => {
  
      console.log('A new user added to DB.');
  
      res.render('secrets');
  
    })
    .catch(err => {
      console.log(err);
      console.log("Unable to add user to database.");
  
    });
})

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username})
    .then(function(foundUser){
        console.log("List exists in the collections");
        if (foundUser){
            if (foundUser.password === password){
                res.render("secrets");
            }
        }
        })
    .catch(function(err){
    console.log(err);
    });
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });