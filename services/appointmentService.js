const appointmentModel = require('../model/appointmentModel');
const userModel = require('../database/userDB').User;

module.exports = {                       
    //logic for finding available doctors comes here
    ///depending on the department the user selects it should choose an available doctor
    //doctor's availability depends on his schedule
    //maybe some kind of logic to find all doctors in a department  that are available
    findAvailableDoctor: async () => {
        try {
            let query = {
                'isAvailable' : true, 
                'user_type': 'DOCTOR'
            }
            const availableDoctor = await userModel.findOne(query) 
            if(!availableDoctor) {
                return {
                    status: 404,
                    message: 'no available doctors',
                    data: null
                }
            }
            return {
                status: 201,
                message: 'available doctor found',
                data: availableDoctor
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Error finding doctor',
                data: error
            }
        }
        
    },
}