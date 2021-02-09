const routes = require('express').Router();
const Datastore = require('nedb');
var db = {};
db.link = new Datastore({ filename: './databases/links' });

routes.get('/', (req, res) => res.redirect('/'))

routes.get('/:documentId', (req, res) => {
    db.link.loadDatabase();
    const document = req.params.documentId;
    try {
        db.links.findOne({ URL: document }, (err, document) => {
            if (err) return res.render('error.ejs', { error: 'An error occurred!' });
            if (document) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.write(document.code)
                res.end();
                if (document.instantDelete) {
                    setTimeout(() => {
                        db.link.remove({ URL: document.URL })
                    }, 1000)
                }
            } else {
                res.render('error.ejs', { error: 'We couldn\'t find that document!' });
            }
        })
    } catch (err) {
        res.render('error.ejs', { error: 'We couldn\'t find that document or an error occurred!' });
    }
})

module.exports = routes;