const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('mongodb');
mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.log(err);
    }
    module.exports = client.db();
    const app = require('./app');
    app.listen(8080);
});