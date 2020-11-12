require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect(process.env.DBNAME, {useNewUrlParser:true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secretKey = process.env.SECRETKEY;
userSchema.plugin(encrypt, {secret: secretKey, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);

app.get("/", function(req, res){
  res.render('home');
});

app.get("/login", function(req, res){
  res.render('login');
});

app.get("/register", function(req, res){
  res.render('register');
});

app.post("/register", function(req, res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(!err){
      res.render('secrets');
    }else{
      console.log(err);
    }
  });
});

app.post("/login", function(req, res){
  User.findOne({email: req.body.username}, function(err, user){
    if(user){
      if( user.password === req.body.password ){
        res.render('secrets');
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started @ 3000 ...");
});
