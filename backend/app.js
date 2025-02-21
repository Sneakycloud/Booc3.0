var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//import session from "express-session";
var logger = require('morgan');
var cors = require("cors");
const dotenv = require("dotenv").config();
const winstoneLogger = require("./Service/winstoneLogger");
const loggerFormatter = require("./Service/httpRequestFormatter");
const responseInterceptor = require("./Service/responseInterceptor");
//const jwt = require('jwt-express');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require("./routes/api");

var app = express();
//Creates socket connection server
const http = require('http');
const {Server} = require("socket.io");


const corsconfig = {
  origin: "http://localhost:3000",
  credentials: true,
}

const server = http.createServer(app);
io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
});

app.io = io;



app.options("*", cors(corsconfig))
app.use(cors(corsconfig));




/*
app.use((req, res, next) => {
  console.log("got request")
  return res.send({msg:"server recived message"});
  next();
});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(function(req, res, next){
  //console.log("Testing")

  winstoneLogger.info("Detected request", loggerFormatter(req,res, {}));
  //winstoneLogger.info("Detected request", {testProperty: "auth"});
  next();
})
*/



//JWT handeling

//middleware that parses incoming tokens and adds them to the req as 
app.use(function(req, res, next) {
  token = req?.header('Authorization');
  if(!token) next();

  req.jwt = jwt.verify(token, process.env.SESSION_SECRET);

  next();
});


//jwt-express init
//app.use(jwt.init(process.env.SESSION_SECRET, {cookies: false}));



//Routes
app.use(responseInterceptor);
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


server.listen(6400)
module.exports = {app,io};


