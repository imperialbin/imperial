const routes = require('express').Router();
const fs = require('fs');
const Datastore = require('nedb');
var db = {};
db.users = new Datastore({ filename: './databases/users' });
db.link = new Datastore({ filename: './databases/links' });
db.betaCodes = new Datastore({ filename: './databases/betaCodes' });
db.plusCodes = new Datastore({ filename: './databases/plusCodes' });
db.emailTokens = new Datastore({ filename: './databases/emailTokens' });
db.resetTokens = new Datastore({ filename: './databases/resetTokens' });


routes.get('/', (req, res) => {
    res.redirect('/');
})

routes.get('/:documentIdOne/:documentIdTwo', (req, res) => {
    const documentOne = req.params.documentIdOne;
    const documentTwo = req.params.documentIdTwo;
    try {
        fs.readFile(`./pastes/${documentOne}.txt`, 'utf-8', (err, documentOneCode) => {
            if (err) return res.render('error.ejs', { error: `We couldn\'t find the document ${documentOne} to compare to ${documentTwo}` });
            fs.readFile(`./pastes/${documentTwo}.txt`, 'utf-8', (err, documentTwoCode) => {
                if (err) return res.render('error.ejs', { error: `We couldn\'t find the document ${documentTwo} to compare to ${documentOne}` });
                if (documentTwoCode && documentOneCode) {
                    res.render('compare.ejs', { documentOne: documentOneCode, documentTwo: documentTwoCode })
                }
            })
        })
    } catch (err) {
        res.render('error.ejs', { error: 'An error occured!' });
        console.log(err);
    }
})

module.exports = routes;