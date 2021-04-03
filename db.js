const mongodb = require('mongodb');
const config = require('./config/dbConfig');
const uri = config.dbUri;
mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.log(err);
    }
    module.exports = client.db();
    const app = require('./app');
    app.listen(8080);
});