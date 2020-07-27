const express = require('express');
const path = require('path');
const app = express();
const expressValidate = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const multer = require('multer');
const flash = require('connect-flash');


//parse incoming request
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//Handle Express Sessions
app.use(session({
	secret: "secret",
	saveUninitialized: true,
	resave: true
}));
//Passport
app.use(passport.initialize());
app.use(passport.session());

//app.use(expressValidate);
// app.use(expressValidate({
// 	errorFormatter: function(param, msg, value){
// 		const namespace = param.split('.')
// 		, root = namespace.shift()
// 		, formParam = root;

// 	 while(namespace.length){
// 	 	formParam += '[' + namespace.shift() + ']';

// 	 }
// 	 return {
// 	 	param: formParam,
// 	 	msg: msg,
// 	 	value: value
// 	 };	
// 	}
// }));

app.use(cookieParser());


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// View Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

//Handle file uploads
//app.use(multer({dest:'./uploads'}));

require('./starter/routes')(app);
require('./starter/db')();
// require('./startup/config')();


const port = process.env.PORT || 10000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;
