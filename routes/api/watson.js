const express = require('express');
const  router = express.Router();
const watsonController = require('../../controller/watsonController');
const {assistant } = require('../../controller/watsonController');
const appointmentController = require('../../controller/appointmentController');
const userController = require('../../controller/userController');

let session_id = null;

//session creation
router.get('/sessions', async (req, res) => {
    try {
        const session = await watsonController.createSession();
        return res.json(session);
    } catch (error) {
        //console.log(error);
        return res.json(error)
    }
})

//send message route
router.post('/message', async (req ,res) => {
    try {
        const reused = session_id != null
        console.log('before: ', session_id);
        if(session_id == undefined || session_id == null){
            const session = await watsonController.createSession();
            session_id = session.result.session_id;
            req.headers.session_id = session_id;
            console.log('now: ',session_id);
        }

        const message = await watsonController.sendMessage(session_id, req.body.input)
        return res.json({message, reused})
    } catch (error) {
        return res.json(error)
    }
})

//get appointment
router.post('/appointment/view', async (req, res) => {
    const result = await appointmentController.view(req);
    //console.log(result.message);
    return res.status(result.status).json(result);
});

//create appointments
router.post('/appointment/create', async (req, res) => {
    //console.log(req.body)
    const result = await appointmentController.create(req);
    return res.status(result.status).json(result)
});

//what happens when i want to create a follow_up appointment
//maybe create it with a 'follow_up' type

module.exports = router

module.exports = router