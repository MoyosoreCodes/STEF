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
    const errors = req.flash('error') || [];
    //console.log(errors);
    const title = "Login"
    return res.render('login', {title, errors});
});

router.get('/patient-forgot-password', function(req, res) {
    //console.log(errors);
    const title = "Forgot Password"
    return res.render('forgot-password', {title, errors});
});

router.post('/patient-login', passport.authenticate('local', 
        {failureRedirect: '/patient-login', failureFlash: true, successRedirect:'/dashboard/patient'}
    )
);

router.post('/patient-register', async (req, res) => {
    try {
        const newUser = await userServices.addUser(req.body)
        if(!newUser){
            return res.json({'error': " errror creating user", })
        }
        console.log(newUser);
        return res.redirect('/login')
    } catch (error) {
        return error
    }
        
})

router.get('/logout', (req, res) => {
    
})
module.exports = router 