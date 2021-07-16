const express = require('express');
const  router = express.Router();
const appointmentController = require('../../controller/appointmentController');
const userController = require('../../controller/userController');

router.get('/create', (req, res) => {
    res.render('appointments');
})

router.get('/status', (req, res) => {
    //create function to view appointment status in the controller
})