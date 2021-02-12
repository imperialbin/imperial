const routes = require('express').Router();
const Users = require('../models/Users');
const getIp = require('ipware')().get_ip;
const mailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Datastore = require('nedb');
var db = {};
db.betaCodes = new Datastore({ filename: './databases/betaCodes' });
db.emailTokens = new Datastore({ filename: './databases/emailTokens' });
require('dotenv').config();

// Middleware
const checkNotAuthenticated = require('../middleware/checkNotAuthenticated');

// Utilities
const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

routes.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { error: false, user: false, email: false });
})

routes.post('/', async (req, res) => {
    db.betaCodes.loadDatabase();
    db.emailTokens.loadDatabase();
    // (Tech) - Quick anon function because I'm really lazy.
    const internalError = (email, user) => { res.render('register.ejs', { error: 'Sorry! There was a internal server error, please contact a administrator!', email, user }); }

    const email = req.body.email.toLowerCase();
    // Why was this made lowercase before?
    const user = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const inviteCode = req.body.code;
    const ip = getIp(req);

    Users.findOne({ name: user }, (err, checkUsername) => {
        if(err) return internalError(email, user);
        if(checkUsername) return res.render('register.ejs', { error: 'That username is taken!', email, user: false });
        
        Users.findOne({ ip: ip.clientIp }, (err, indexIp) => {
            if(err) return internalError(email, user);
            if(indexIp) return res.render('register.ejs', { error: 'IP is already associated with an account!', email, user });
            
            if(password.length < 8) return res.render('register.ejs', { error: 'Please make your password atleast 8 characters long!', email, user });
            if(password !== confirmPassword ) return res.render('register.ejs', { error: 'Passwords do not match!', email, user });

            db.betaCodes.findOne({ betaCode: inviteCode }, (err, code) => {
                if(err) return internalError(email, user);
                if(!code) return res.render('register.ejs', { error: 'Invalid invite code!', email, user });
            
                Users.findOne({ email: email }, async (err, data) => {
                    if(err) return internalError(email, user);
                    try {
                        if(data) return res.render('register.ejs', { error: 'A user with that email already has an account!', email: false, user });
                       
                        const emailToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
                        db.emailTokens.insert({ token: emailToken, email: email, used: false });
   
                        const hashedPass = await bcrypt.hash(password, 13);
                        const newUser = new Users({
                            name: user,
                            email: email,
                            betaCode: inviteCode,
                            banned: false,
                            confirmed: false,
                            ip: ip.clientIp,
                            codesLeft: 0,
                            icon: '/assets/img/pfp.png',
                            password: hashedPass,
                            memberPlus: false,
                            codes: []
                        });
                        await newUser.save();
                      
                        const mailOptions = {
                            from: 'IMPERIAL',
                            to: email,
                            subject: 'Confirm your email',
                            text: 'Hey there!',
                            html: `Please click this link to verify your email! <br> https://www.imperialb.in/auth/${emailToken}` 
                        };

                        transporter.sendMail(mailOptions, err => {
                            if(err) console.log(`Failed to send confirmation email to ${user}!`);
                            
                            db.betaCodes.remove({ betaCode: inviteCode }, (err) => console.log(err))
                            Users.findOneAndUpdate({ codes: { code: inviteCode } }, { $pull: { 'codes': { 'code': inviteCode } } }, (err, result) => console.log(err))
                            
                            return res.render('success.ejs', { successMessage: `Please check your email to verify! (${email})` })
                        });
                    } catch { return internalError(email, user); }
                });
            });
        });
    });
});

module.exports = routes;