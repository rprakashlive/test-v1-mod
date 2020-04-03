var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var mongoose = require('mongoose');
const cors = require('cors');



// Mongo Connect
// mongoose.connect('mongodb://localhost:27017/portal',{
//    useUnifiedTopology: true,
//    useNewUrlParser: true
//    });
// mongoose.connection.on('connected', () => {
//   console.log('Connected to database ');
// }); 
// mongoose.connection.on('error', (err) => {
//   console.log('Database error: '+ err);
// });


var app = express();
var server = require('http').createServer(app);


const io = require('socket.io')(server, {cookie: false});

io.on("connection", socket => {
  console.log('Socket connected')
  socket.on("element-comm", data => {
    console.log("data",data);
    io.emit("element-comm", data);
  });

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(bodyParser());
// app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
// app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));

app.use(bodyParser.json({limit: '200mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}))

//app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS Policy
// Add headers
app.use(cors());
app.options('*', cors());

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });


// const whitelist = ['http://localhost:4200', '*'];
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin, callback) => {
//     if(whitelist.includes(origin))
//       return callback(null, true)
//       callback(new Error('Not allowed by CORS'));
//   }
// }
// app.use(cors(corsOptions));


app.use('/', indexRouter);
app.use('/products/', productRouter);
app.use('/users/', usersRouter);






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

//app.listen(9000);
var port = 9000;
// Start Server
server.listen(port, () => {
  console.log('Server started on port '+port);
});
module.exports = app;
