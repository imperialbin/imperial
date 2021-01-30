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

routes.get('/', (req, res) => res.redirect('/'))

routes.get('/:documentId', (req, res) => {
    db.link.loadDatabase();
    const document = req.params.documentId;
    try {
        fs.readFile(`./pastes/${document}.txt`, (err, data) => {
            if (err) return res.render('error.ejs', { error: 'We couldn\'t find that document or an error occurred!' });
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.write(data)
            res.end();
            db.link.findOne({ URL: document }, (err, doc) => {
                if (doc.instantDelete) {
                    setTimeout(() => {
                        fs.unlink(`./pastes/${doc.URL}.txt`, err => {
                            if (err) return err;
                            db.link.remove({ _id: doc._id })
                        })
                    }, 1000);
                }
            })
        })
    } catch (err) {
        res.render('error.ejs', { error: 'We couldn\'t find that document or an error occurred!' });
    }
})

module.exports = routes;