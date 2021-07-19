const {User} = require('../database/userDB');
const { Appointment } = require('../model/appointmentModel');
const {Session} = require('../model/sessionModel');
const userServices = require('../services/userServices');

module.exports = {
    //create/update sessions 
    createUserSession: async (data) => {
        try {
            const body = data.body
            const foundUser = await userServices.getPatientId(body.patientId);
            if (foundUser.status !== 200)
            {
                return {
                    status: foundUser.status,
                    message: foundUser.message,
                }   
            }
            const newSession = await Session.create(body);
            
            const session = await Session.findOne({_id: newSession._id})

            const updatedUser = await User.updateOne({
                patientId: foundUser.data._id,
            }, {$push:{'sessions': session._id}});

            return {
                status: 200,
                message: 'session created successfully',
                data: updatedUser
            }
        } catch (error) {
            console.log('catch error');
            return {
                status: 500,
                message: "Session creation failed",
                data: error
            }
        }
    },
    //create/update records 
    createUserAppointments: async (data) => {
        try {
            const body = data.body
            const patient =  data.session.passport.user;
            const counsellor = await userServices.findAvailableCounsellor()
            // const foundUser = await userServices.getPatientId(body.patientId);
            if (counsellor.status !== 200)
            {
                return {
                    status: counsellor.status,
                    message: counsellor.message,
                }   
            }
            const x = {patient, counsellor:counsellor.data._id}
            Object.assign(body, x) // adds x to body
            console.log(body);
            const newAppointment = await Appointment.create(body);
            
            const appointment = await Appointment.findOne({_id: newAppointment._id})

            const updatedUser = await User.updateOne({
                _id: patient,
            }, {$push:{'appointments': appointment._id}});

            return {
                status: 200,
                message: 'Appointment created successfully',
                data: updatedUser
            }
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                message: "Session creation failed",
                data: error
            }
        }
    }
}