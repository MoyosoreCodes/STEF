const {User} = require('../database/userDB');
const { Appointment } = require('../model/appointmentModel');
const {Session} = require('../model/sessionModel');
const userServices = require('../services/userServices');

module.exports = {
    //create/update records 
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
            const foundUser = await userServices.getPatientId(body.patientId);
            if (foundUser.status !== 200)
            {
                return {
                    status: foundUser.status,
                    message: foundUser.message,
                }   
            }
            const newAppointment = await Appointment.create(body);
            
            const appointment = await Appointment.findOne({_id: newAppointment._id})

            const updatedUser = await userDb.updateOne({
                patientId: foundUser.data._id,
            }, {$push:{'appointments': appointment._id}});

            return {
                status: 200,
                message: 'Appointment created successfully',
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
    }
}