const mongoose = require('mongoose');
const Schema = mongoose.Schema

const appointment_status = {
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED',
    APPROVED: 'APPROVED'
}

const vist_types = {
    ACADEMIC: 'ACADEMIC',
    SPIRITUAL: 'SPIRITUAL',
}
const appointmentObject = {
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    couselling_type: {
        type: String,
        default: vist_types.ACADEMIC
    },
    appointmentDate: String,
    appointmentTime: String,
    counsellor:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:{select: '-password first_name last_name email phoneNumber'}
    },
    status: {type: String, default: appointment_status.PENDING}
};

const appointmentSchema = Schema(appointmentObject, {timestamps: true});
//appointmentSchema.plugin(require('mongoose-autopopulate'));
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {Appointment, appointment_status}