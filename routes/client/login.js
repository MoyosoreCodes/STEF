const express = require('express')
const router = express.Router();
const passport = require('../../config/passport-config');
const userServices = require('../../services/userServices');

//middleware
/*
const validations = [       
    body('firstname')
        .isLength({min:1})
        .withMessage('Firstname is required'),
    body('lastname')
        .isLength({min:1})
        .withMessage('Lastname is required'), 
    body('password')
        .isLength({min: 6})
        .withMessage('Password length is 6 characters long'),
    body('email')
        .isEmail()
        .custom( async (email) => {
            const user = await Users.findOne({email});
            if (user){
                throw new Error('Email has been registered');
            }
        })
        .withMessage('invalid email')
];
*/
router.get('/', function(req, res) {
    const title = "Home"
    res.render('landing', {title});
});

router.get('/patient-login', function(req, res) {
    const errors = req.flash().error || [];
    //console.log(errors);
    const title = "Login"
    return res.render('login', {title, errors});
});

router.get('/forgot-password', function(req, res) {
    //console.log(errors);
    const title = "Forgot Password"
    return res.render('forgot-password', {title});
});

router.post('/patient-login', passport.authenticate('local', 
        {failureRedirect: '/patient-login', failureFlash: true, successRedirect:'/dashboard/'}
    )
);

router.get('/counsellor-login', (req, res) => {
    return res.render('counsellorRegister')
});

router.post('/patient-register', async (req, res) => {
    try {
        const newUser = await userServices.addUser(req.body)
        if(!newUser){
            return res.json({'error': " errror creating user", })
        }
        console.log(newUser);
        return res.redirect('/patient-login')
    } catch (error) {
        return error
    }
        
})

router.post('/counsellor-register', async (req, res) => {
    try {
        const body = req.body;
        const user_type = {
            'user_type': "COUNSELLOR"
        }
        Object.assign(body, user_type)
        const newUser = await userServices.addUser(body)
        if(!newUser){
            return res.json({'error': " errror creating user", })
        }
        console.log(newUser);
        return res.redirect('/patient-login')
    } catch (error) {
        return error
    }
})

router.get('/faq', (req, res) => {
    return res.render('faq')
})

router.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/');
})
module.exports = router 