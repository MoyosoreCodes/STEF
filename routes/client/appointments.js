const express = require('express');
const  router = express.Router();
const appointmentController = require('../../controller/appointmentController');
const userController = require('../../controller/userController');
const { User } = require('../../database/userDB');

router.post('/create', async (req, res) => {console.log('here');
        const _id =  req.session.passport.user;
        const user = await User.findById({_id});
        console.log(`${user.first_name} is making appointment`);
        console.log(req.body);
        if((user.user_type.toUpperCase() == user_types.STAFF) || (user.user_type.toUpperCase() == user_types.STUDENT)){
            await userController.createUserAppointments(req)
            return res.redirect('/dashboard/patient')
        }
        return res.redirect('/landing')
})

// router.get('/status', (req, res) => {
//     //create function to view appointment status in the controller
// })
module.exports = router 