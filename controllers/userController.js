const User = require('../models/User');
const Post = require('../models/Post');

exports.mustBeLoogedIn = function(req, res, next) {
    if(req.session.user) {
       next(); 
    } else {
        req.flash('errors', 'You must be log in to create a post');
        req.session.save(() => {
            res.redirect('/');
        });
    }
}

exports.login = (req, res) => {
    let user = new User(req.body);
    user.login().then((result) => {
        req.session.user = { avatar: user.avatar, username: user.data.username, _id: user.data._id }
        req.session.save(() => {
            res.redirect('/');
        });
    }).catch((err) => {
        req.flash('errors', err);
        req.session.save(() => {
            res.redirect('/');
        });
    });
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.register = (req, res) => {
    let user = new User(req.body);
    user.register().then(() => {
        req.session.user = { avatar: user.avatar, username: user.data.username, _id: user.data._id }
        req.session.save(() => {
            res.redirect('/');
        });
    }).catch((regErrors) => {
        regErrors.map((err) => {
            req.flash('regErrors', err);
        });
        req.session.save(() => {
            res.redirect('/');
        });

    });
}

exports.home = (req, res) => {
    if (req.session.user) {
        res.render('home-dashboard');
    } else {
        res.render('home-guest', {
            errors: req.flash('errors'),
            regErrors: req.flash('regErrors')
        });
    }
}

exports.ifUserExits = function(req, res, next) {
    User.findByUsername(req.params.username).then((userDocument) => {
        req.profileUser = userDocument;
        next();
    }).catch(() => {
        res.render('404');
    });
}

exports.profilePostsScreen = function(req, res) {

    // get post from post collection by login usernam
    Post.findByAuthorId(req.profileUser._id).then((posts) => {
        res.render('profile', {
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            posts: posts
        });
    }).catch(() => {
        res.render('404');
    });
}