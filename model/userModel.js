const mongoose = require("mongoose");

const user_types = {
    STAFF: 'STAFF',
    STUDENT: 'STUDENT',
    COUNSELLOR : 'COUNSELLOR'
};

const GenericUserObject = {
    first_name: {type: String,trim: true, required: [true,'please provide first name'], index:true},
    last_name: {type: String,trim: true, required: [true,'please provide last name'], index:true},
    email: {type: String,trim: true, required: [true,'please provide email address'], match: [/\S+@\S+\.\S+/, 'is invalid'], index:  {unique: true, dropDups: true}},
    patientId: {type: String,trim: true, required: [true,'please provide matriculation number'], match: [/^[a-z0-9]+$/i, 'is invalid'], index:  {unique: true, dropDups: true}},
    password: {type:String, required:[true,'please provide password']},
    department: String,
    level:String,
    //doctors only
    Location:String,
    phoneNumber:String,
    grade:String,
    user_type: {type: String,default: user_types.STUDENT},
    //address: String,
    last_login: {type: Date, default: Date.now()},
    //payment_details: GenericPaymentDetails,
    gender:String,
    sessions: [{
        type: mongoose.Types.ObjectId,
        ref: 'sessions',
        //autopopulate: true
    }],
    appointments: [{
        type: mongoose.Types.ObjectId,
        ref: 'appointments',
        //autopopulate: true
    }],
    //image: { type: Object, trim: true},
    //for doctors only
    isAvailable: {type: Boolean}
};

module.exports={
    GenericUserObject, user_types
}