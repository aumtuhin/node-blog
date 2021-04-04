const bycrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection("users");
const validator = require('validator');
const md5 = require('md5');

let User = function (data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function () {
    if (typeof (this.data.username) != "string") this.data.username = "";
    if (typeof (this.data.password) != "string") this.data.password = "";
    if (typeof (this.data.email) != "string") this.data.email = "";

    //get rid of bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        //valiadition of user data
        if (this.data.username == "") this.errors.push('You must provide a username');
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) this.errors.push('Username can only contain letters and numbers');
        if (!validator.isEmail(this.data.email)) this.errors.push('You must provide a valid email address');
        if (this.data.password == "") this.errors.push('You must provide a password');
        if (this.data.password.length > 0 && this.data.password.length < 8) this.errors.push('Passwodr must be at least 8 Charecters');
        if (this.data.password.length > 50) this.errors.push('Password can not exceed 100 charecters');
        if (this.data.username.length > 0 && this.data.username.length < 3) this.errors.push('Username must be at least 3 Charecters');
        if (this.data.username.length > 30) this.errors.push('Username can not exceed 30 charecters');

        // Only if username is valid then check to see if it's already taken
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await usersCollection.findOne({ username: this.data.username })
            if (usernameExists) { this.errors.push("That username is already taken.") }
        }

        //on if email is valid and then check it already taken or not
        if (validator.isEmail(this.data.email)) {
            let emailExits = await usersCollection.findOne({ email: this.data.email });
            if (emailExits) this.errors.push('That email is already being used');
        }

        resolve();

    });
}

User.prototype.login = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        usersCollection.findOne({ username: this.data.username }).then((user) => {
            if (user && bycrypt.compareSync(this.data.password, user.password)) {
                this.data = user;
                this.getAvatar();
                resolve("Congrats");
            } else {
                reject("Invalid username or password");
            }
        }).catch((err) => {
            reject("Please again letare");
        });
    });
}

User.prototype.register = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate();

        // if there are no validation errors
        if (!this.errors.length) {
            // hash user password
            let salt = bycrypt.genSaltSync(10);
            this.data.password = bycrypt.hashSync(this.data.password, salt);
            await usersCollection.insertOne(this.data);
            this.getAvatar(); 
            resolve();
        } else {
            reject(this.errors);
        }
    });
}

User.prototype.getAvatar = function() {
    
    this.avatar = `https://gravatar.com/avatar/b7${md5(this.data.email)}?s=400&d=robohash&r=x`;
}

module.exports = User;