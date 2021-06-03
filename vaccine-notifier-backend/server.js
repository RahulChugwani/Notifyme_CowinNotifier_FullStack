const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const moment = require('moment');

require('dotenv').config();

const availableNotifier = require('./available-notifier');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000 ;


const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once( 'open', ()=>{
    console.log("Mongodb connection successful ofcourse");
});

const usersRouter = require('./routes/user');
app.use('/users', usersRouter);

app.get('/', function (req, res) {
  res.send('Hello World this is Vaccine Notifier!');
});

app.listen(port, function () {
  console.log('Example app listening on port 4000!');
});

availableNotifier.main();
