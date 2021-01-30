const LocalStrategy = require('passport-local').Strategy
const Users = require('./models/Users');
const bcrypt = require('bcrypt')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        Users.findOne({ $or: [{ 'email': email.toLowerCase() }, { 'name': email.toLowerCase() }] }, async (err, user) => {
            if (!user) return done(null, false, { message: 'No user with that email' })
            if (user.confirmed) {
                if (!user.banned) {
                    try {
                        if (await bcrypt.compare(password, user.password)) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    } catch (e) {
                        return done(e)
                    }
                } else {
                    return done(null, false, { message: 'You are banned!' })
                }
            } else {
                return done(null, false, { message: 'Please confirm your email!' })
            }
        })
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user._id);
        })
    })
}

module.exports = initialize