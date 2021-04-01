const  express = require('express');

// intit app
const app = express();  
// routes
const router = require('./router');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//set up views folder
app.set('views', 'views');
 //view engine
 app.set('view engine', 'ejs');
 //statci files
 app.use(express.static('public'));

app.use('/', router);

module.exports = app;