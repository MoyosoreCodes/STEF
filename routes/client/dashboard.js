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
// *get routes*
router.get('/admin', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        return res.render('admin', { user })
    }
    return res.redirect('/landing')
});

router.get('/patient', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.render('patient', { user })
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
        const allAppointments = await Appointment.find();
        return res.render('appointments', { user, allAppointments})
    }
    return res.redirect('/landing')
})

router.get('/sessions', authUser, async (req,res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const allSessions = await Session.find();
        return res.render('sessions', { user, allSessions})
    }
    return res.redirect('/landing')
})

// *post routes*
//edit users
router.post('/users/update', authUser, async (req, res) => {
    const body = req.body
    const foundUser = await userServices.getPatientId(body.patientId)
    if(foundUser.status !== 200) { return res.redirect('/admin/users');}
    await User.updateOne(
        {patientId: body.patientId}, 
        {body}, 
    )
    return res.redirect('/admin/users');
})

router.post('/users/delete', authUser, async (req, res) => {
    const body = req.body
    const foundUser = await userServices.getPatientId(body.patientId)
    if(foundUser.status !== 200) { return res.redirect('/admin/users');}
    await userServices.deleteUser(foundUser._id);
    return res.redirect('/admin/users');
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

router.post('/appointments', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        await userController.createUserAppointments(req)
        return res.redirect('/appointments')
    }
    return res.redirect('/landing')
})
module.exports = router 