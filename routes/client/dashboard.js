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
        const allAppointments = await Appointment.find();
        return res.render('activity', { user, allAppointments})
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
router.post('admin/users/update', authUser, async (req, res) => {
    const body = req.body
    const foundUser = await userServices.getPatientId(body.patientId)
    if(foundUser.status !== 200) { return res.redirect('/admin/users');}
    await User.updateOne(
        {patientId: body.patientId}, 
        {body}, 
    )
    return res.redirect('/admin/users');
})

router.post('admin/users/delete', authUser, async (req, res) => {
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

router.post('/activity-log', authUser, async (req, res) => {
    console.log('here');
    const {appointmentDate,
        appointmentTime,
        couselling_type, new_password} = req.body;
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(appointmentDate, appointmentTime, couselling_type) {
        if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
            await userController.createUserAppointments(req)
            return res.redirect('/dashboard/activity-log')
        }
        return res.redirect('/landing')
    }

    if(new_password){
        if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
            await user.setPassword(new_password)
            return res.redirect('/dashboard/activity-log')
        }
        return res.redirect('/landing')
    }
    
})
module.exports = router 