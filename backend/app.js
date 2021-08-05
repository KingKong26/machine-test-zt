var express = require('express');
const dotenv = require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var apiRouter = require('./routes/api');
var app = express();
const mongoose = require("mongoose");

// cors head
const corsOption = {
  credentials: true,
  origin:['http://localhost:3000'] 
}

app.use(cors(corsOption))

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    console.log("Connected to Mongodb");
  }
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

module.exports = app;
