const routes = require('express').Router();
const fs = require('fs');
const Users = require('../models/Users');
const Datastore = require('nedb');
var db = {};
db.link = new Datastore({ filename: './databases/links' });

routes.get('/', (req, res) => {
    res.redirect(`/p/${req.originalUrl.split('/')[1]}/${req.originalUrl.split('/')[2]}`)
})


// This entire thing i will be redoing soon lmfao
routes.get(['/:documentId', '/:slug/:documentId', '/:slug/:slugTwo/:documentId', '/:slug/:slugTwo/slugThree/:documentId'], (req, res) => {
    const documentId = req.params.documentId;
    db.link.loadDatabase();
    try {
        fs.readFile(`./pastes/${documentId}.txt`, 'utf-8', (err, code) => {
            if (code) {
                db.link.findOne({ URL: documentId }, (err, doc) => {
                    var enableImageEmbed;
                    if (!doc.instantDelete) {
                        const month = new Date(doc.deleteDate).getMonth() + 1 // we have to put a + 1 here because months start at 0
                        const day = new Date(doc.deleteDate).getDate()
                        const year = new Date(doc.deleteDate).getFullYear()
                        var deleteDate = `Deletes on ${month}/${day}/${year}`
                    } else {
                        if (!req.isCrawler()) {
                            setTimeout(() => {
                                fs.unlink(`./pastes/${doc.URL}.txt`, err => {
                                    if (err) return err;
                                    db.link.remove({ _id: doc._id })
                                })
                            }, 1000);
                        }
                        var deleteDate = 'Deletes after being viewed.'
                    }
                    if (doc.imageEmbed && fs.existsSync(`./public/assets/img/${documentId}.jpeg`))
                        var enableImageEmbed = true
                    else
                        var enableImageEmbed = false
                    if (req.isAuthenticated()) {
                        Users.findOne({ _id: req.user }, (err, user) => {
                            const editorArray = doc.allowedEditor
                            if (req.user == doc.creator || editorArray.indexOf(req.user) != -1) {
                                var creator = true;
                            } else {
                                var creator = false;
                            }
                            res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: code, loggedIn: true, pfp: user.icon, deleteDate: deleteDate, creator: creator })
                        })
                    } else {
                        res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: code, loggedIn: false, deleteDate: deleteDate, creator: false })
                    }
                })
            } else if (err) {
                res.render('error.ejs', { error: 'We couldn\'t find that document!' });
            }
        })
    } catch (err) {
        console.log(err)
    }
})

module.exports = routes;
