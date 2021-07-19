const express = require('express');
const userController = require('../../controller/userController');
const router = express.Router();
const {User} = require('../../database/userDB');
const { Appointment } = require('../../model/appointmentModel');
const { Session } = require('../../model/sessionModel');
const { user_types } = require('../../model/userModel');
const userServices = require('../../services/userServices');

const authUser = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }
    else {
        return res.status(401).redirect('/login')
    }
}

router.get('/', (req, res) => {
    const _id =  req.session.passport.user;
    const user = await userDB.User.findOne({_id})
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        return res.redirect('/dashboard/counsellor')
    }
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.redirect('/dashboard/patient')
    }
    return res.redirect('/landing')
})

// *get routes*
router.get('/counsellor', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const sessions = await Session.find()
        const appointments = await Appointment.find()
        return res.render('Dashboard', { user, sessions, appointments })
    }
    return res.redirect('/landing')
});

router.get('/patient', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.render('profile', { user })
    }
    return res.redirect('/landing')
})

router.get('/activity-log', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    const appointments = await Appointment.find({patient:user._id});
    const sessions = await Session.find({patient:user._id})
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.render('activity', { user, appointments, sessions })
    }
    return res.redirect('/landing')
})

router.get('/users', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const allUsers = await User.find();
        return res.render('users', { user, allUsers})
    }
    return res.redirect('/landing')
});

router.get('/appointments', authUser, async (req,res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const appointments = await Appointment.find();
        return res.render('appointment', { user, appointments})
    }
    return res.redirect('/landing')
})

router.get('/sessions', authUser, async (req,res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const patients = await User.find();
        return res.render('sessions', { user, patients})
    }
    return res.redirect('/landing')
})

router.get('/update/:id', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const patient = await User.findOne({_id: req.params.id});
        return res.render('profileUpdate', { user, patient})
    }
    return res.redirect('/landing')
})

router.get('/view/:id', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const patient = await User.findOne({_id: req.params.id});
        const session = await Session.findOne({patientId: req.params.id})
        return res.render('profileUpdate', { user, patient, session})
    }
    return res.redirect('/landing')
})
// *post routes*
//edit users
router.post('/update/:id', authUser, async (req, res) => {
    const body = req.body
    await User.updateOne(
        {patientId: req.params.id}, 
        {body}, 
    )
    return res.redirect('/dashboard/users');
})

router.post('/delete/:id', authUser, async (req, res) => {
    // const body = req.body
    // const foundUser = await userServices.getPatientId(body.patientId)
    // if(foundUser.status !== 200) { return res.redirect('/admin/users');}
    await userServices.deleteUser(req.params.id);
    return res.redirect('/dashboard/users');
})

router.post('/sessions', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
       await userController.createUserSession(req)
        return res.redirect('/sessions')
    }
    return res.redirect('/landing')
})

router.post('/forgot-password', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    const {new_password} = req.body
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        await user.setPassword(new_password)
        return res.redirect('/dashboard/activity-log')
    }
    return res.redirect('/landing');    
})
module.exports = router 