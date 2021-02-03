const routes = require('express').Router();
const Datastore = require('nedb');
const fs = require('fs');
const Users = require('../models/Users');
const webshot = require('webshot-node');
var db = {};
db.link = new Datastore({ filename: './databases/links' });
db.betaCodes = new Datastore({ filename: './databases/betaCodes' });
db.plusCodes = new Datastore({ filename: './databases/plusCodes' });
db.emailTokens = new Datastore({ filename: './databases/emailTokens' });
db.resetTokens = new Datastore({ filename: './databases/resetTokens' });


// Utilites
const throwApiError = require('../utilities/throwApiError');

routes.get('/', (req, res) => res.json({ message: 'Welcome to Imperial Bin\'s API!' }))

routes.post(['/document', '/postCode', '/paste'], (req, res) => {
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
                const creator = user._id.toString()
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
                return throwApiError(res, "You need to post code! No code was submitted!");
            }
        } catch (err) {
            return throwApiError(res, "An internal server error occurred, please contact an admin!");
        }
    }
})

routes.patch(['/document', '/editCode', '/paste'], (req, res) => {
    const apiToken = req.headers.authorization;
    const document = req.body.document;
    const newCode = req.body.newCode;
    if (!apiToken) return throwApiError(res, "Please put in an API token!")
    Users.findOne({ apiToken }, (err, user) => {
        if (err) return throwApiError(res, "An internal server error occurred! Please contact an admin!")
        if (user) {
            const userId = user._id.toString();
            db.link.loadDatabase();
            db.link.findOne({ URL: document }, (err, documentInfo) => {
                if (documentInfo) {
                    const editorArray = documentInfo.allowedEditor
                    if (documentInfo.creator === userId || editorArray.indexOf(userId) != -1) {
                        fs.writeFile(`./pastes/${document}.txt`, newCode, () => {
                            res.json({
                                success: true,
                                message: 'Successfully edited the document!',
                                documentId: document,
                                rawLink: `https://www.imperialb.in/r/${document}`,
                                formattedLink: `https://www.imperialb.in/p/${document}`,
                                expiresIn: new Date(documentInfo.deleteDate),
                                instantDelete: documentInfo.instantDelete
                            })
                        })
                    } else {
                        return throwApiError(res, "You do not have access to edit this document!")
                    }
                } else {
                    return throwApiError(res, "We couldn't find that document!")
                }
            })
        } else {
            return throwApiError(res, "Invalid API token!")
        }
    })
})

/* routes.delete('/purgePastes', async (req, res) => {
    var index = { 'apiToken': req.headers.authorization };
    if (req.isAuthenticated()) {
        const authedUser = await Users.findOne({ _id: req.user.toString() })
        var index = { '_id': authedUser._id };
    }
    if (!index) return throwApiError(res, "Please put in an API token!");
    Users.findOne(index, (err, user) => {
        if (err) return throwApiError(res, "An internal server error occurred! Please contact an admin!")
        if (user) {
            const creator = user._id.toString();
            db.link.loadDatabase()
            db.link.find({ creator }, (err, documents) => {
                if (err) return throwApiError(res, "An internal server error occurred! Please contact an admin!");
                if (documents[0]) {
                    for (var entry = 0, len = documents.length; entry < len; entry++) {
                        const _id = documents[entry]._id;
                        fs.unlink(`./pastes/${documents[entry].URL}.txt`, err => {
                            if (err) return err;
                            db.link.remove({ _id })
                        })
                        if (documents[entry].imageEmbed) {
                            fs.unlinkSync(`./public/assets/img/${documents[entry].URL}.jpeg`)
                        }
                    }
                    if (Object.keys(index).indexOf('_id') > -1) return res.redirect('/account')
                    res.json({
                        success: true,
                        message: `Deleted a total of ${documents.length} documents!`
                    })
                } else {
                    return throwApiError(res, "There was no documents to delete!");
                }
            })
        } else {
            return throwApiError(res, "Invalid API token!")
        }
    })
}) */

routes.delete(['/document/:slug', '/deleteCod/:slug', '/paste/:slug'], async (req, res) => {
    var index = { 'apiToken': req.headers.authorization };
    if (req.isAuthenticated()) {
        const authedUser = await Users.findOne({ _id: req.user.toString() })
        var index = { '_id': authedUser._id };
    }
    if (!index) return throwApiError(res, "Please put in an API token!");
    const document = req.params.slug;
    Users.findOne(index, (err, user) => {
        if (err) return throwApiError(res, "An internal server error occurred! Please contact an admin!")
        if (user) {
            const userId = user._id.toString();
            db.link.loadDatabase();
            db.link.findOne({ URL: document }, (err, documentInfo) => {
                if (documentInfo) {
                    // Only allow the owner of the document to delete
                    if (documentInfo.creator === userId) {
                        db.link.remove({ _id: documentInfo._id })
                        fs.unlink(`./pastes/${documentInfo.URL}.txt`, err => {
                            if (err) return throwApiError(res, "An internal server error occurred! Please contact an admin!")
                            if (documentInfo.imageEmbed) {
                                fs.unlinkSync(`./public/assets/img/${documentInfo.URL}.jpeg`)
                            }
                            if (Object.keys(index).indexOf('_id') > -1) return res.redirect('/account')
                            res.json({
                                success: true,
                                message: "Successfully delete the document!"
                            })
                        })
                    } else {
                        return throwApiError(res, "You do not have access to delete this document!")
                    }
                } else {
                    return throwApiError(res, "We couldn't find that document!")
                }
            })
        } else {
            return throwApiError(res, "Invalid API token!")
        }
    })
})

routes.get(['/document/:slug', '/getCode/:slug', '/paste/:slug'], (req, res) => {
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
                return throwApiError(res, "We couldn't find that document!");
            }
        })
    } catch (err) {
        return throwApiError(res, "An internal server error has occurred!");
    }
})

routes.get('/checkApiToken/:apiToken', (req, res) => {
    const apiToken = req.headers.authorization || req.params.apiToken;
    Users.findOne({ apiToken }, (err, valid) => {
        if (err) return throwApiError(res, "An internal server error has occurred!");
        if (valid) {
            res.json({
                success: true,
                message: 'API token is valid!'
            })
        } else {
            return throwApiError(res, "API token is invalid!");
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
            "RequestURL": "https://imperialb.in/api/postCode/",
            "Headers": {
                "Authorization": apiToken
            },
            "Body": "JSON",
            "Data": "{\n  \"code\": \"$input$\",\n  \"longerUrls\": false,\n  \"imageEmbed\": true,\n  \"instantDelete\": false\n}",
            "URL": "$json:formattedLink$"
        });
})

module.exports = routes;