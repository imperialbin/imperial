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
        db.link.findOne({ URL: documentId }, (err, document) => {
            if (err) return res.render('error.ejs', { error: 'An error occurred whilst getting that document!' });
            if (document) {
                var enableImageEmbed;
                if (!document.instantDelete) {
                    const documentDate = new Date(document.deleteDate);
                    const month = documentDate.getMonth() + 1 // we have to put a + 1 here because months start at 0
                    const day = documentDate.getDate()
                    const year = documentDate.getFullYear()
                    var deleteDate = `Deletes on ${day}/${month}/${year}`
                } else {
                    if (!req.isCrawler()) {
                        setTimeout(() => {
                            db.link.remove({ URL: document.URL });
                        }, 1000)
                        var deleteDate = 'Deletes after being viewed.'
                    }
                }
                if (document.imageEmbed && fs.existsSync(`./public/assets/img/${documentId}.jpeg`)) {
                    var enableImageEmbed = true;
                } else {
                    var enableImageEmbed = false;
                }
                if (req.isAuthenticated()) {
                    const userId = req.user.toString();
                    Users.findOne({ _id: userId }, (err, user) => {
                        const editorArray = document.allowedEditor;
                        if (userId == document.creator || editorArray.indexOf(userId) != -1) {
                            var creator = true;
                        } else {
                            var creator = false;
                        }
                        res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: document.code, loggedIn: true, pfp: user.icon, deleteDate: deleteDate, creator: creator, originalCreator: document.creator, incomingUser: userId })
                    })
                } else {
                    res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: document.code, loggedIn: false, deleteDate: deleteDate, creator: false })
                }
            } else {
                res.render('error.ejs', { error: 'We couldn\'t find that document!' });
            }
        })
    } catch (err) {
        res.render('error.ejs', { error: 'An error occurred whilst getting that document!' });
    }
})

module.exports = routes;
