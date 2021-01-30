const routes = require('express').Router();
const Datastore = require('nedb');
const fs = require('fs');
const Users = require('../models/Users');
const webshot = require('webshot-node');
var db = {};
db.users = new Datastore({ filename: './databases/users' });
db.link = new Datastore({ filename: './databases/links' });
db.betaCodes = new Datastore({ filename: './databases/betaCodes' });
db.plusCodes = new Datastore({ filename: './databases/plusCodes' });
db.emailTokens = new Datastore({ filename: './databases/emailTokens' });
db.resetTokens = new Datastore({ filename: './databases/resetTokens' });

routes.get('/', (req, res) => res.json({ message: 'Welcome to Imperial Bin\'s API!' }))

routes.post('/postCode/', (req, res) => {
    db.link.loadDatabase();
    const code = req.body.code;
    if (req.headers.authorization || req.body.apiToken) {
        const apiToken = req.headers.authorization || req.body.apiToken;
        Users.findOne({ apiToken }, (err, user) => {
            if (user) {
                const longerUrls = req.body.longerUrls || false
                const imageEmbed = req.body.imageEmbed || false
                var expiration = req.body.expiration || 5
                const instantDelete = req.body.instantDelete || false
                const creator = user._id
                var quality = 40;
                var str = Math.random().toString(36).substring(2)
                if (user.memberPlus)
                    var quality = 80;
                if (longerUrls)
                    var str = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
                if (expiration >= 31)
                    var expiration = 31;
                createPaste(str, imageEmbed, instantDelete, expiration, creator, quality);
            } else {
                createPaste(Math.random().toString(36).substring(2), false, false, 5, 'NONE');
            }
        })
    } else {
        createPaste(Math.random().toString(36).substring(2), false, false, 5, 'NONE');
    }
    function createPaste(str, imageEmbed, instantDelete, expiration, creator, quality) {
        try {
            if (code) {
                db.link.insert({ URL: str, imageEmbed: imageEmbed, dateCreated: new Date().getTime(), deleteDate: new Date().setDate(new Date().getDate() + Number(expiration)), instantDelete: instantDelete, creator: creator, allowedEditor: [] }, (err, doc) => {
                    fs.writeFile(`./pastes/${str}.txt`, code, () => {
                        res.json({
                            success: true,
                            documentId: str,
                            rawLink: `https://www.imperialb.in/r/${str}`,
                            formattedLink: `https://www.imperialb.in/p/${str}`,
                            expiresIn: new Date(doc.deleteDate),
                            instantDelete: instantDelete
                        })
                    })
                    if (quality && !instantDelete && imageEmbed) {
                        console.log('screenshotting');
                        webshot(`https://www.imperialb.in/p/${str}`, `./public/assets/img/${str}.jpeg`, { customCSS: ".menu, #messages {display:none}", quality: quality, captureSelector: '.hljs' }, err => {
                            if (err) return db.link.update({ URL: str }, { $set: { imageEmbed: false } })
                            db.link.update({ URL: str }, { $set: { imageEmbed: true } })
                        });
                    }
                })
            } else {
                res.json({
                    success: false,
                    message: "You need to post code! No code was submitted!"
                })
            }
        } catch (err) {
            res.json({
                success: false,
                message: "An internal server error occured, please contact an admin!"
            })
        }
    }
})

routes.get('/getCode/:slug', (req, res) => {
    const document = req.params.slug;
    try {
        fs.readFile(`./pastes/${document}.txt`, (err, data) => {
            if (data) {
                const rawData = data.toString();
                res.json({
                    success: true,
                    document: rawData
                });
            } else {
                res.json({
                    success: false,
                    message: 'We couldn\'t find that document!'
                });
            }
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: 'An internal server error has occured!'
        });
    }
})

routes.get('/checkApiToken/:apiToken', (req, res) => {
    const apiToken = req.headers.authorization || req.params.apiToken;
    Users.findOne({ apiToken }, (err, valid) => {
        if (err) {
            return res.json({
                success: false,
                message: 'A server error has occured!'
            })
        }
        if (valid) {
            res.json({
                success: true,
                message: 'API token is valid!'
            })
        } else {
            res.json({
                success: false,
                message: 'API token is invalid!'
            })

        }
    })
})

routes.get('/getShareXConfig/:apiToken', (req, res) => {
    const apiToken = req.headers.authorization || req.params.apiToken;
    res.attachment('imperialbin.sxcu')
        .send({
            "Version": "13.4.0",
            "DestinationType": "TextUploader",
            "RequestMethod": "POST",
            "RequestURL": "https://www.imperialb.in/api/postCode/",
            "Body": "FormURLEncoded",
            "Arguments": {
                "code": "$input$",
                "apiToken": apiToken,
                "longerUrls": "false",
                "instantDelete": "false",
                "imageEmbed": "false",
                "expiration": "14"
            },
            "URL": "$json:formattedLink$"
        });
})

module.exports = routes;