const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
// intit app
const app = express();

//session middleware and configurations
let sessionOptions = session({
    secret: "this is something for making our session cool",
    store: new MongoStore({ client: require('./db') }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

app.use(sessionOptions);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// express bodyprser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//set up views folder
app.set('views', 'views');
//view engine
app.set('view engine', 'ejs');
//statci files
app.use(express.static('public'));

// require all routes
const router = require('./router');

//routes
app.use('/', router);

module.exports = app;