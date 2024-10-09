var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//import session from "express-session";
var session = require("express-session")
var logger = require('morgan');
var cors = require("cors");
const dotenv = require("dotenv").config();
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require("./routes/api");

var app = express();
//Creates socket connection server
const http = require('http');
const {Server} = require("socket.io");
const sharedsession = require("express-socket.io-session");


const corsconfig = {
  origin: "http://localhost:3000",
  credentials: true,
}

const server = http.createServer(app,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});
const io = new Server(server);

app.use(function(req, res, next){
  //console.log("Testing")
  next();
})



app.options("*", cors(corsconfig))
app.use(cors(corsconfig));

//Creates mongoDB connection for session storage, https://www.npmjs.com/package/connect-mongodb-session
var store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@booc.oduvk.mongodb.net/Booc?retryWrites=true&w=majority&appName=Booc `,
  databaseName: "Booc",
  collection: 'mySessions',
});

//Catches errors with storing sessions
store.on('error', function(error) {
  console.log(error);
});


//Implements sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false, //turns off storing empty sessions
  resave: false,
  cookie: {
    maxAge: 1000*60*60*24, //24 hours
  },
  store: store,
}));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/*
app.use((req, res, next) => {
  console.log(req.session)
  next();
});
*/

//IO uses shared session
io.use(sharedsession(session, {
  autoSave: true,
}));

io.on('connection', (socket) => {
  //socket.handshake.session = req.session
  socket.on('connect', function(socket){
    try{
    socket.handshake.session.socket = socket.id;
  }
  catch(err){
    console.log("Failed to establish socket connection");
    console.log(err);
  }
  })
  
  
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = {app,io,server};
