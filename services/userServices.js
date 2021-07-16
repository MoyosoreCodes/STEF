const userModels = require('../model/userModel');
const userDB = require('../database/userDB');
const user_type = require('../model/userModel').user_types

module.exports = {
    addUser: async function(data){
        try {       
            //let user_type = data.user_type
            let dbUser = userDB.User
            let email = data.email

            let existingUser = await dbUser.findOne({email})
        
            if(existingUser){
                console.log("extra check to stop users from registering")
                return {
                    'code':11000,
                    'message': "User already exists"
                }
            }
            let newUser = new dbUser(data);
            
            if(newUser.user_type.toUpperCase() === userModels.user_types.COUNSELLOR){      
                newUser.isAvailable = true;
            }    
            // set password
            const hashedpassword = await newUser.setPassword(data.password)
            if(hashedpassword) {
                newUser.password = hashedpassword
                console.log('password hashed successfully');
            }
            else{ console.log('could not hash password');}

            return await newUser.save().then(function (result,err) {
                if (result) {
                    return result
                } else {
                    return err
                }
            }).catch(function (err) {
                    return err
            })

        } catch (error) {
            return error
        }
    },
    getPatientId: async (patientId) => {

        try{
            let dbUser = userDB.User;
            patientId.trim();

            const user = await dbUser.findOne({patientId});
            //console.log(user);
            if(!user) {
                return {
                    status: 404,
                    message: 'User Data not Found',
                    data: null
                }
            }

            return {
                status: 200,
                message: 'User Data Found',
                data: user
            }
        }catch(err) {
            return {
                status: 500,
                message: 'error when retrieving user data',
                data: null
            }
        }

    },
    findAvailableCounsellor: async () => {
        try {
            let query = {
                'isAvailable' : true, 
                'user_type': `${user_type.COUNSELLOR}`
            }
            const dbUser = userDB.User;
            const availableCounsellor = await dbUser.findOne(query) 
            if(!availableCounsellor) {
                return {
                    status: 404,
                    message: 'no available doctors',
                    data: null
                }
            }
            return {
                status: 200,
                message: 'available doctor found',
                data: availableCounsellor
            }
        } catch (error) {
            return {
                status: 500,
                message: 'Error finding doctor',
                data: error
            }
        }
        
    },
    deleteUser: async (_id) => {
        let dbUser = userDB.User;
        await dbUser.deleteOne({_id},function (err) {
            if(err){return err}
        });
        return true
    },
    updateUser: async (data) => {
        try {
            let user = userDB.User;
            return await user.updateOne({_id: data._id},
                data);
        }catch (e) {
            return e // promises do this already: catch just to return it.
        }
    }
}