const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const userDb = require('../database/userDB');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
            usernameField: 'patientId',
            passwordField: 'password',
            passReqToCallback: true
        }, 
        async function( req, username, password, done) {
            // const patientId = username;
            let query 
            if(username.includes('@')){
                query = {
                    'email':username
                }
            }else {
                query = {
                    'patientId':username
                }
            }
            const user = await userDb.User.findOne(query)
            if (!user) {
                console.log("User Doesn't Exist");
                return done(null, false, req.flash('error', "User Doesn't Exist"));
            }
            const match = await user.validatePassword(password)
            if(match == 'password does not match'){
                console.log('Incorrect password');
                return done(null, false, req.flash('error', "Incorrect password"));
            }

            return done(null, user);
        }
    )
)

passport.serializeUser((user, done) => {
    console.log('Serialized: ',user._id );
    done(null, user._id)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

module.exports = passport