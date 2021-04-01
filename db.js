const app = require('./app');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tuhin:test54321@cluster0.qerog.mongodb.net/node-blog?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    module.exports = client.db();
    app.listen(8080);
});