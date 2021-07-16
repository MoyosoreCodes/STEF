const {Appointment, appointment_types, appointment_status} = require('../model/appointmentModel');
const { user_types } = require('../model/userModel');
const userServices = require('../services/userServices');
const userDb = require('../database/userDB').User

module.exports ={
//who can create appointments?? 
//if it's  patients then the creation process should check for available doctors
    create: async (data) => {
        try {
            //initialize variables
            const body = data.body;
            console.log(body)
            var availableDoctor, patient

            const foundUser = await userServices.getPatientId(body.patientId);
            if (foundUser.status !== 200)
            {
                return {
                    status: foundUser.status,
                    message: foundUser.message,
                }   
            }
            const user = foundUser.data;

            
            if(user.user_type.toUpperCase() == user_types.PATIENT) {
                //then check for available doctors
                const counsellor = await userServices.findAvailableCounsellor();
                if(counsellor.status !== 200)
                {
                    return {
                        status: counsellor.status,
                        message: counsellor.message,
                    }   
                }
                availableDoctor = {'counsellor': counsellor.data._id};
                Object.assign(body, availableDoctor);
                //if there is an available counsellor 
                
                if(body.doctor !== null || body.doctor !== undefined || body.doctor == ''){
                    //then create appointment for patient
                    patient = {'patient': user._id};
                    Object.assign(body, patient);
                    console.log(body)
                    const newAppointment = await Appointment.create(body);
                    if(!newAppointment) {
                        console.log('error is at making new appointment');
                        return {
                            status: 500,
                            message: 'There was an error while making your appointment, please proceed to fill out the form',
                            data: null
                        }
                    }
                    const appointment = await Appointment.findOne({_id: newAppointment._id})
                    const updatedUser = await userDb.updateOne({
                        _id: user._id,
                    }, {$push:{'appointments': appointment._id}});
                    return {
                        status: 200,
                        message: `Appointments created successfully with Dr. ${counsellor.data.first_name}`,
                        data: updatedUser
                    }
                }
            }
        } catch (error) {
            console.log('catch error');
            return {
                status: 500,
                message: "We're currently experienceing issues from our server. Cannot make appointment for you at this time ",
                data: error
            }
        }   
    },

    // view: async (data) => {
    //     try{
    //         const {patientId, appointmentDate} = data.body;
    //         const foundUser = await userServices.getPatientId(patientId);
    //         const user = foundUser.data

    //         const userAppointments =  await Appointment.find({
    //             patient: user._id, 
    //             status: `${appointment_status.PENDING}`,
    //             appointmentDate
    //         });
    //         const appointmentCount = userAppointments.count();

    //         console.log(userAppointments);
    //         if(!userAppointments || userAppointments == []) {
    //             return {
    //                 status: 404,
    //                 message: `You have no pending appointments for ${appointmentDate}`,
    //                 data: null
    //             }
    //         }

    //         return {
    //             status: 200,
    //             message: `You have ${appointmentCount} pending appointment(s) for ${appointmentDate}`,
    //             url:'https://ehrsys-api.herokuapp.com/dashboard/appointments',
    //             data: null
    //         }
    //     }catch (err) {
    //         console.log('catch error');
    //         return {
    //             status: 500,
    //             message: "Sorry I'm having technical difficulties retrieving your appointments",
    //             data: error
    //         }
    //     }
    // },
}