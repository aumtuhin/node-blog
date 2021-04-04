const User = require('../models/User');


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
        req.session.user = { avatar: user.avatar, username: user.data.username }
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
        req.session.user = { avatar: user.avatar, username: user.data.username }
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
