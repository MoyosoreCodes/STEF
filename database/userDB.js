const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {GenericUserObject} = require('../model/userModel');
const bcrypt = require('bcrypt');

//function for setting password
var setPassword = async function(password){
    try { 
        const hashedpassword = await bcrypt.hash(password, 8);
        //if process fails
        if(!hashedpassword || hashedpassword == undefined || hashedpassword == null){
            throw('Error hashing the password');
        }
        //if process is complete
        return hashedpassword
    } catch (err) {
        return err
    }
};

//function for validating password
var validatePassword = async function(password){
    try {  

        const match = await bcrypt.compare(password, this.password);
        if(!match) {
            throw('password does not match')
        }

        return match;

    } catch (err) {
        return err
    }
};

const userObject = GenericUserObject;
const userSchema = new Schema(userObject, {timestamps: true});
userSchema.methods.setPassword = setPassword;
userSchema.methods.validatePassword = validatePassword;

const User = mongoose.model('User', userSchema, 'users');

module.exports ={
    User
}
