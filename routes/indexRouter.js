const routes = require('express').Router();
const Users = require('../models/Users');
const fs = require('fs');
const webshot = require('webshot-node');
const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const mailer = require('nodemailer');
var db = {};
db.users = new Datastore({ filename: './databases/users' });
db.link = new Datastore({ filename: './databases/links' });
db.betaCodes = new Datastore({ filename: './databases/betaCodes' });
db.plusCodes = new Datastore({ filename: './databases/plusCodes' });
db.emailTokens = new Datastore({ filename: './databases/emailTokens' });
db.resetTokens = new Datastore({ filename: './databases/resetTokens' });
db.betaCodes.loadDatabase()
db.plusCodes.loadDatabase()
db.emailTokens.loadDatabase()
db.resetTokens.loadDatabase()
db.link.loadDatabase();

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

// Middleware
const checkAuthenticated = require('../middleware/checkAuthenticated');
const checkNotAuthenticated = require('../middleware/checkNotAuthenticated');

routes.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        Users.findOne({ _id: req.user.toString() }, (err, user) => {
            res.render('index.ejs', { loggedIn: true, pfp: user.icon })
        })
    } else {
        res.render('index.ejs', { loggedIn: false })
    }
})

routes.get('/success', (req, res) => {
    res.render('success.ejs', { successMessage: 'bruh' })
})

routes.get(['/discord', '/dis', '/dsc'], (req, res) => {
    res.redirect('https://discord.com/invite/cTm85eW49D')
})

routes.get(['/github', '/gh', '/git'], (req, res) => {
    res.redirect('https://github.com/imperialbin')
})

routes.get('/forgot', (req, res) => {
    res.render('forgot.ejs', { error: false });
})

routes.get('/resetPassword/:resetToken', (req, res) => {
    const resetToken = req.params.resetToken;
    db.resetTokens.find({ token: resetToken }, (err, data) => {
        if (err) return console.log(err);
        if (!data == undefined || !data.length == 0) {
            res.render('resetPassword.ejs', { token: resetToken, error: false })
        } else {
            res.render('error.ejs', { error: 'Token is not valid!' })
        }
    })
})

routes.get('/redeem', checkAuthenticated, (req, res) => {
    res.render('redeem.ejs', { error: false })
})

routes.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return console.log(err);
        req.session = null;
        req.logout();
    })
    res.redirect('/login');
})

routes.post('/saveCode', (req, res) => {
    const code = req.body.code;
    const securedUrls = JSON.parse(req.body.securedUrls.toString().toLowerCase())
    var instantDelete = JSON.parse(req.body.instantDelete.toString().toLowerCase())
    var imageEmbeds = JSON.parse(req.body.imageEmbeds.toString().toLowerCase())
    var time = req.body.time;
    var str = Math.random().toString(36).substring(2);
    var allowedEditor = req.body.allowedEditor;
    if (req.isAuthenticated()) {
        if (securedUrls) var str = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        if (time >= 31) var time = 31
        var creator = req.user.toString(); // this has to be like this mainly because its being dumb, and has a bunch of rando characters even tho its a string, wtf man?
    } else {
        var time = 7;
        var instantDelete = false;
        var creator = 'none'
        var allowedEditor = 'NONE'
        var imageEmbeds = false;
    }
    try {
        // Check if input is more than 0
        if (code.length > 0) {
            if (req.isAuthenticated()) {
                db.link.insert({
                    URL: str,
                    imageEmbed: imageEmbeds,
                    dateCreated: new Date().getTime(),
                    deleteDate: new Date().setDate(new Date().getDate() + Number(time)),
                    instantDelete: instantDelete,
                    creator: creator,
                    allowedEditor: []
                })
                if (allowedEditor) {
                    for (var editor = 0; editor < allowedEditor.split(',').length; editor++) {
                        Users.findOne({ name: allowedEditor.split(',')[editor] }, (err, user) => {
                            if (err) return console.log(err);
                            if (user) {
                                db.link.update({ URL: str }, { $push: { allowedEditor: user._id.toString() } })
                                db.link.loadDatabase();
                            }
                        })
                    }
                }
                // Check for image embeds
                if (imageEmbeds && !instantDelete) {
                    Users.findOne({ _id: req.user.toString() }, (err, user) => {
                        if (err) return db.link.update({ URL: str }, { $set: { imageEmbed: false } })
                        if (user) {
                            // Change the quality of paste depending if you are Member+ or not
                            if (user.memberPlus) var quality = 80;
                            else var quality = 40;
                            // Take a screenshot of the paste
                            webshot(`https://www.imperialb.in/p/${str}`, `./public/assets/img/${str}.jpeg`, { customCSS: '.menu, #messages { display:none }', quality: quality, captureSelector: '.hljs' }, err => {
                                if (err) return db.link.update({ URL: str }, { $set: { imageEmbed: false } })
                                db.link.update({ URL: str }, { $set: { imageEmbed: true } })
                            });
                        }
                    })
                }
            } else {
                db.link.insert({
                    URL: str,
                    imageEmbed: imageEmbeds,
                    dateCreated: new Date().getTime(),
                    deleteDate: new Date().setDate(new Date().getDate() + Number(time)),
                    instantDelete: instantDelete,
                    creator: creator,
                    allowedEditor: 'NONE'
                })
            }
            fs.writeFile(`./pastes/${str}.txt`, code, () => {
                res.json({
                    status: 'success',
                    link: `/p/${str}`
                })
            })
            db.link.loadDatabase();
        }
    } catch (err) {
        console.log(err);
    }
})

routes.post('/editCode', (req, res) => {
    const code = req.body.code;
    const documentId = req.body.documentId;
    if (req.isAuthenticated()) {
        db.link.find({ URL: documentId }, (err, doc) => {
            if (doc[0].creator == req.user.toString() || doc[0].allowedEditor.indexOf(req.user.toString()) != -1) {
                fs.writeFile(`./pastes/${documentId}.txt`, code, () => {
                    res.json({
                        status: 'success'
                    })
                })
            }
        })
    } else {
        res.json({
            success: false,
            message: 'You aren\'t logged in!'
        })
    }
})

routes.post('/requestResetPassword', checkNotAuthenticated, (req, res) => {
    const email = req.body.email.toLowerCase();
    Users.findOne({ email: email }, (err, user) => {
        if (err || user == null) {
            return res.render('forgot.ejs', { error: 'We couldn\'t find a user with that email!' })
        }
        try {
            const resetToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
            db.resetTokens.insert({ token: resetToken, email: email, used: false })
            let mailOptions = {
                from: 'IMPERIAL',
                to: email,
                subject: 'Reset Password',
                text: 'Hey there!',
                html: `Please click this link to reset your password! <br> https://www.imperialb.in/resetPassword/${resetToken}`
            }
            transporter.sendMail(mailOptions, () => res.render('success.ejs', { successMessage: `Please check your email at ${email}` }))
        } catch {
            res.render('error.ejs', { error: 'An unexpected error happened!' })
        }
    })
})

routes.post('/resetPassword', (req, res) => {
    const resetToken = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    db.resetTokens.find({ token: resetToken }, async (err, data) => {
        if (!data == undefined || !data.length == 0) {
            if (password.length >= 8) {
                if (password)
                    if (confirmPassword === password) {
                        const hashedPass = await bcrypt.hash(password, 13);
                        res.render('success.ejs', { successMessage: 'Successfully resetted your password!' });
                        Users.updateOne({ email: data[0].email }, { $set: { password: hashedPass } }, err => {
                            if (err) return err;
                        });
                        db.resetTokens.remove({ token: resetToken })
                    } else {
                        res.render('resetPassword.ejs', { token: resetToken, error: 'Passwords do not match!' })
                    }
            } else {
                res.render('resetPassword.ejs', { token: resetToken, error: 'Your password must be 8 characters long!' })
            }
        } else {
            res.render('error.ejs', { error: 'That token has already been used!' })
        }
    })
})

module.exports = routes;