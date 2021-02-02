const routes = require('express').Router();
const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const fetch = require('node-fetch');
const Datastore = require('nedb');
var db = {};
db.link = new Datastore({ filename: './databases/links' });
db.betaCodes = new Datastore({ filename: './databases/betaCodes' });
db.plusCodes = new Datastore({ filename: './databases/plusCodes' });
db.betaCodes.loadDatabase()
db.plusCodes.loadDatabase()

routes.get('/', (req, res) => {
    db.link.loadDatabase();
    Users.findOne({ _id: req.user }, (err, user) => {
        if (user) {
            db.link.find({ creator: req.user.toString() }).sort({ dateCreated: -1 }).limit(10).exec((err, pastes) => {
                res.render('account.ejs', { user: user, error: false, success: false, codeError: false, pfpError: false, pastes: pastes })
            })
        }
    })
})

routes.post('/redeem', (req, res) => {
    const code = req.body.code;
    db.plusCodes.find({ code }, (err, codeData) => {
        if (codeData) {
            if (!codeData[0].used) {
                Users.updateOne({ _id: req.user }, { $set: { memberPlus: true } }, err => {
                    if (err) return console.log(err);
                })
                db.plusCodes.remove({ _id: codeData[0]._id });
                res.render('success.ejs', { successMessage: 'You are now Member+!' })
            }
        } else {
            console.log('couldn\'t find that code!')
        }
    })
})

routes.post('/resetPasswordForm', (req, res) => {
    const id = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    Users.findOne({ _id: id }, async (err, user) => {
        db.link.find({ creator: req.user }).sort({ dateCreated: -1 }).limit(10).exec(async (err, pastes) => {
            if (await bcrypt.compare(oldPassword, user.password)) {
                if (newPassword.length >= 8) {
                    if (newPassword == confirmPassword) {
                        const hashedPass = await bcrypt.hash(newPassword, 13);
                        Users.updateOne({ _id: id }, { $set: { password: hashedPass } }, err => {
                            if (err) return console.log(err);
                        })
                        res.render('account.ejs', { user: user, error: false, success: 'Successfully reset your password!', codeError: false, pfpError: false, pastes: pastes })
                    } else {
                        res.render('account.ejs', { user: user, error: 'New passwords do not match!', success: false, codeError: false, pfpError: false, pastes: pastes })
                    }
                } else {
                    res.render('account.ejs', { user: user, error: 'Please make the password more than 8 characters long!', success: false, codeError: false, pfpError: false, pastes: pastes })
                }
            } else {
                res.render('account.ejs', { user: user, error: 'Incorrect old password!', success: false, codeError: false, pfpError: false, pastes: pastes })
            }
        })
    })
})

routes.post('/changePfp', (req, res) => {
    const gitHubName = req.body.pfp;
    const pfpUrl = `https://github.com/${gitHubName}.png`
    fetch(`https://github.com/${gitHubName}.png`)
        .then(data => {
            Users.findOne({ _id: req.user }, (err, user) => {
                db.link.find({ creator: req.user }).sort({ dateCreated: -1 }).limit(10).exec((err, pastes) => {
                    if (data.status == 200) {
                        try {
                            Users.updateOne({ _id: req.user }, { $set: { icon: pfpUrl } }, err => {
                                if (err) return console.log(err);
                            })
                            res.render('account.ejs', { user: user, error: false, success: false, codeError: false, pfpError: false, pastes: pastes })
                        } catch (err) {
                            res.render('account.ejs', { user: user, error: 'An error has occured whilst trying to change your pfp!', success: false, codeError: false, pfpError: false, pastes: pastes })
                        }
                    } else {
                        res.render('account.ejs', { user: user, error: false, success: false, codeError: false, pfpError: 'We couldn\'t find that GitHub user!', pastes: pastes })
                    }
                })
            })
        })
})

routes.post('/changePfpGravatar', async (req, res) => {
    const gravatarEmail = req.body.pfp;
    const gravatarUrl = await gravatar.url(gravatarEmail);
    Users.findOne({ _id: req.user }, (err, user) => {
        db.link.find({ creator: req.user }).sort({ dateCreated: -1 }).limit(10).exec((err, pastes) => {
            try {
                Users.updateOne({ _id: req.user }, { $set: { icon: gravatarUrl } }, err => {
                    if (err) return console.log(err);
                })
                res.render('account.ejs', { user: user, error: false, success: false, codeError: false, pfpError: false, pastes: pastes })
            } catch (err) {
                res.render('account.ejs', { user: user, error: false, success: false, codeError: false, pfpError: 'An error has occured whilst trying to change your pfp!', pastes: pastes })
            }
        })
    })
})

routes.post('/createInvite', (req, res) => {
    db.betaCodes.loadDatabase();
    Users.findOne({ _id: req.user }, (err, user) => {
        if (err) return console.log(err);
        db.link.find({ creator: req.user }).sort({ dateCreated: -1 }).limit(10).exec((err, pastes) => {
            if (user.codesLeft > 0) {
                const str = Math.random().toString(36).substring(4);
                Users.updateOne({ _id: req.user }, { $set: { codesLeft: user.codesLeft - 1 }, $push: { codes: { code: str } } }, err => {
                    if (err) return console.log(err);
                })
                db.betaCodes.insert({ betaCode: str }, () => res.render('account.ejs', { user: user, error: false, success: false, codeError: false, pfpError: false, pastes: pastes }))
            } else {
                res.render('account.ejs', { user: user, error: false, success: false, codeError: 'You\'ve exceeded your max invite count!', pfpError: false, pastes: pastes })
            }
        })
    })
})

routes.get('/createPlusInvite', (req, res) => {
    db.plusCodes.loadDatabase();
    if (req.user === '5fc9720765dd66032764a077') {
        const plusCode = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        db.plusCodes.insert({ code: plusCode, used: false })
        res.render('success.ejs', { successMessage: `Plus code: ${plusCode}` });
    } else {
        res.redirect('/');
    }
})

routes.post('/changeEmail', (req, res) => {
    const email = req.body.email;
    console.log(email);
})

routes.post('/updateApiToken', (req, res) => {
    Users.updateOne({ _id: req.user }, { $set: { 'apiToken': createToken() } }, err => {
        if (err) return res.render('error.ejs', { error: 'There was an error creating your API token!' })
        res.redirect('/account');
    })
})

function createToken() {
    return 'IMPERIAL-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = routes;