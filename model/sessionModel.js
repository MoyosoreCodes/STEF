const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sessionObject = {
    patientId: [{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        //autopopulate:true
    }],
    //find data for records you can use them for medication
    observations: {type: String, default: 'PENDING'},
    treatment: {type: String, default: 'N/A'},
    intervention: [{type: String, default: 'N/A'}],
    topics_discussed:[{type:String}],
    themes_discussed: [{type: String, default: 'N/A'}],
    responses: [{type: String, default: 'N/A'}],
    
}
const sessionSchema = Schema(sessionObject, {timestamps: true});
//userRecordSchema.plugin(require('mongoose-autopopulate'));
const Session =  mongoose.model('sessions', sessionSchema, 'sessions');
module.exports = {sessionObject, Session}