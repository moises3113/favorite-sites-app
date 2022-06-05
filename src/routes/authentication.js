const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn, isLoggedOut } = require('../lib/auth')

//------------Login---------------------
router.get('/signin', isLoggedOut, (req,res)=>{
    res.render('auth/signin')
})

router.post('/signin', isLoggedOut, (req,res,next)=>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next)
})

//------------New user---------------------
router.get('/signup', isLoggedOut,(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup', isLoggedOut, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

//----------Profile-----------------------
router.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile')
})

//----------Logout---------------------
router.get('/logout', isLoggedIn, (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/signin');
      });
})

module.exports = router