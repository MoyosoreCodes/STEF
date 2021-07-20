const express = require('express');
const userController = require('../../controller/userController');
const router = express.Router();
const {User} = require('../../database/userDB');
const { Appointment, appointment_status } = require('../../model/appointmentModel');
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

router.get('/', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findOne({_id})
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        return res.redirect('/dashboard/counsellor')
    }
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.redirect('/dashboard/patient')
    }
    return res.redirect('/')
})

// *get routes*
router.get('/counsellor', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const sessions = await Session.find()
        const appointments = await Appointment.find()
        const pendingAppointments = await Appointment.find({status: appointment_status.PENDING})
        return res.render('Dashboard', { user, sessions, appointments, pendingAppointments })
    }
    return res.redirect('/')
});

router.get('/patient', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.render('profile', { user })
    }
    return res.redirect('/')
})

router.get('/activity-log', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    const appointments = await Appointment.find({patient:user._id});
    const sessions = await Session.find({patient:user._id})
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        return res.render('activity', { user, appointments, sessions })
    }
    return res.redirect('/')
})

router.get('/users', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const users = await User.find();
        return res.render('users', { user, users})
    }
    return res.redirect('/')
});

router.get('/profile', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const allUsers = await User.find();
        return res.render('profile2', { user, allUsers})
    }
    return res.redirect('/')
});

router.get('/appointments', authUser, async (req,res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const appointments = await Appointment.find()
        const patients = await User.find();
        return res.render('appointment', { user, appointments, patients})
    }
    return res.redirect('/')
})

router.get('/appointments/accept/:id', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
            await Appointment.updateOne(
                {_id: req.params.id}, 
                {status: appointment_status.APPROVED}
            )
            // const patient = await userDB.User.findOne({cardNumber: req.params.cardNumber});
            // const appointments = await Appointment.find({doctor: _id}).populate('patient', 'first_name last_name cardNumber');
            return res.redirect('/dashboard/appointments')
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }        
    }
});

router.get('/appointments/decline/:id', authUser, async (req, res) => {
    try {
        const _id =  req.session.passport.user;
        const user = await userDB.User.findOne({_id})
        if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
            await Appointment.updateOne(
                {_id: req.params.id}, 
                {status: appointment_status.CANCELLED}
            )
            return res.redirect('/dashboard/appointments')
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error); 
        return {
            status: 500,
            message: 'catch error at route',
            data: error 
        }       
    }
});

router.get('/session', authUser, async (req,res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const patients = await User.find();
        return res.render('createSession', { user, patients})
    }
    return res.redirect('/')
})

router.get('/update/:id', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const patient = await User.findOne({_id: req.params.id});
        const session = await Session.findOne({patientId: req.params.id})
        return res.render('profileUpdate', { user, patient})
    }
    return res.redirect('/')
})

router.get('/view/:id', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    if(user.user_type.toUpperCase() == user_types.COUNSELLOR){
        const patient = await User.findOne({_id: req.params.id});
        const session = await Session.findOne({patientId: req.params.id})
        return res.render('profileUpdate', { user, patient, session})
    }
    return res.redirect('/')
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
    return res.redirect('/')
})

router.post('/forgot-password', authUser, async (req, res) => {
    const _id =  req.session.passport.user;
    const user = await User.findById({_id});
    const {new_password} = req.body
    if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
        await user.setPassword(new_password)
        return res.redirect('/dashboard/activity-log')
    }
    return res.redirect('/');    
})
module.exports = router 