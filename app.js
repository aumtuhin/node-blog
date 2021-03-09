const  express = require('express');
// intit app
const app = express();  
// routes
const router = require('./router');

//set up views folder
app.set('views', 'views');
 //view engine
 app.set('view engine', 'ejs');
 //statci files
 app.use(express.static('public'));

app.use('/', router);

app.listen(8080, () => {
    console.log('app is listening on port 8080');
});