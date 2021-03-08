const  express = require('express');


// intit app
const app = express();

app.get('/', (req, res) => {
    res.send({
        msg: 'hello'
    });
});

app.listen(8080, () => {
    console.log('app is listening on port 8080');
});