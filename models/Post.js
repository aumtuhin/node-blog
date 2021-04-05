const postsCollection = require('../db').db().collection("posts");
const ObjectID = require('mongodb').ObjectID;

let Post = function (data, userId) {
  this.data = data;
  this.userId = userId;
  this.errors = [];
}

Post.prototype.cleanUp = function () {
  if (typeof (this.data.title) != "string") this.data.title = "";
  if (typeof (this.data.body) != "string") this.data.body = "";

  // get rid of any bogus properties
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: ObjectID(this.userId)
  }
}

Post.prototype.validate = function () {
  if (this.data.title == "") this.errors.push("You must provide a title.");
  if (this.data.body == "") this.errors.push("You must provide post content.");
}

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      postsCollection.insertOne(this.data).then(() => {
        resolve();
      }).catch(() => {
        this.errors.push('Please try again later.');
        reject(this.errors);
      });
    } else {
    }
  });
}

Post.findSingleById = function (id) {
  return new Promise(async (resolve, reject) => {
    if (typeof (id) != "string" || !ObjectID.isValid(id)) {
      reject();
      return
    } else {
      let post = await postsCollection.findOne({ _id: new ObjectID(id) });
      if(post) {
        resolve(post);
      } else {
        reject();
      }
    }
  });
}

module.exports = Post;