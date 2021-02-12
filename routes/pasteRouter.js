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
            if(err) return res.render('error.ejs', { error: 'An error occurred whilst getting that document!' });
            if(!document) return res.render('error.ejs', { error: 'We couldn\'t find that document!' });

            if(document.instantDelete) {
                if(!req.isCrawler()) {
                    setTimeout(() => {
                        db.link.remove({ URL: document.URL });
                    }, 1 * 1000);
                }
                var deleteDate = "Deletes after being viewed.";    
            } else {
                const documentDate = new Date(document.deleteDate);
                const date = {
                    year: documentDate.getFullYear(),
                    month: documentDate.getMonth() + 1,
                    day: documentDate.getDate() 
                };
                var deleteDate = `Deletes on ${date.day}/${date.month}/${date.year}.`;
            }
            var enableImageEmbed;
            if (document.imageEmbed && fs.existsSync(`./public/assets/img/${document.URL}.jpg`)) enableImageEmbed = true;
            else enableImageEmbed = false;

            if(req.isAuthenticated()) {
                const userId = req.user.toString();
                Users.findOne({ _id: userId }, (err, user) => {
                    // If there's some sort of error just return the Guest paste.
                    if(err) return res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: document.code, loggedIn: false, deleteDate: deleteDate, creator: false });
                    
                    var creator;
                    if (userId == document.creator || editorArray.indexOf(userId) != -1) creator = true;
                    else creator = false;
                    return res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: document.code, loggedIn: true, pfp: user.icon, deleteDate: deleteDate, creator: creator, originalCreator: document.creator, incomingUser: userId });
                });
            }
            return res.render('pasted.ejs', { documentName: documentId, imageEmbed: enableImageEmbed, code: document.code, loggedIn: false, deleteDate: deleteDate, creator: false });
        });
    } catch(_) {
        return res.render('error.ejs', { error: 'An error occurred whilst getting that document!' });
    }
});

module.exports = routes;
