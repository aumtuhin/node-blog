const express = require('express');
const router =  express.Router();

//home route
router.get('/', (req, res) => {
    res.render('home-guest');
});

//about route
router.get('/about', (req, res) => {
    res.send('This is our about');
});


module.exports = router;