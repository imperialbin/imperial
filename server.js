const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const Datastore = require('nedb');
const mongoose = require('mongoose');
const fs = require('fs');
const passport = require('passport');
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')
const CronJob = require('cron').CronJob;
const rateLimit = require('express-rate-limit');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const MongoStore = require('connect-mongo')(session);
const CrawlerDetect = require('crawler-detect');
var db = {};
db.link = new Datastore({ filename: './databases/links' });
db.link.loadDatabase();
require('dotenv').config();

// Middleware
const checkAuthenticated = require('./middleware/checkAuthenticated');

// Database
mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@users.vc1kj.mongodb.net/USERS?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return err;
    console.log('CONNECTED DATABASE');
})
const Users = require('./models/Users');

// Passport

initializePassport(passport)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 120 * 60 * 60 * 1000 }, store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 5 * 24 * 60 * 60, autoRemove: 'interval', autoRemoveInterval: 10 }), unset: 'destroy' }))
app.use(passport.initialize())
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(CrawlerDetect.express());
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');
app.set('view-engine', 'ejs');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    handler: function (req, res, next) {
        if (req.headers.authorization || req.body.apiToken) {
            const apiToken = req.headers.authorization || req.body.apiToken;
            Users.findOne({ apiToken }, (err, user) => {
                if (user) {
                    next();
                } else {
                    res.status(429).json({
                        success: false,
                        message: "API token is invalid! Please get an API token at https://imperialb.in/account"
                    });
                }
            })
        } else {
            res.status(429).json({
                success: false,
                message: "You have reached the 15 requests every 15 minutes, please link an API key to raise that amount! (https://www.imperialb.in/account)"
            });
        }
    }
});

var job = new CronJob('00 00 00 * * *', () => {
    db.link.find({}, (err, data) => {
        console.log('attempting')
        for (var entry = 0, len = data.length; entry < len; entry++) {
            if (new Date().getTime() >= data[entry].deleteDate) {
                try {
                    const id = data[entry]._id;
                    fs.unlink(`./pastes/${data[entry].URL}.txt`, err => {
                        if (err) return err;
                        db.link.remove({ _id: id })
                    })
                    if (data[entry].imageEmbed) {
                        fs.unlink(`./public/assets/img/${data[entry].URL}.jpeg`, err => { if (err) console.log(err) })
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
    })
}, null, true, 'America/Los_Angeles');
job.start();

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// Routes
const indexRouter = require('./routes/indexRouter');
const accountRouter = require('./routes/accountRouter');
const authRouter = require('./routes/authRouter');
const apiRouter = require('./routes/apiRouter');
const rawRouter = require('./routes/rawRouter');
const compareRouter = require('./routes/compareRouter');
const pasteRouter = require('./routes/pasteRouter');

// Initialize the routes
app.use('/', indexRouter);
app.use('/account', checkAuthenticated, accountRouter);
app.use('/api', apiLimiter, apiRouter);
app.use('/auth', authRouter);
app.use(['/raw', '/r', '/raw/:documentId', '/r/:documentId'], rawRouter);
app.use(['/c', '/compare', '/c/:documentIdOne/:documentIdTwo', '/compare/:documentIdOne/:documentIdTwo'], compareRouter);
app.use(['/p', '/paste', '/document', '/d', '/paste/:documentId', '/p/:documentId', '/document/:documentId', '/d/:documentId', '/:slug/:documentId', '/:slug/:slugTwo/:documentId', '/:slug/:slugTwo/slugThree/:documentId'], pasteRouter);


process.on('uncaughtException', (err, origin) => {
    fs.writeSync(
        process.stderr.fd,
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`
    );
})

// SOCKET IO STUFF
// this shit literally doesnt work, i think its my fault for the nginx config, but fuck men, like what the hell dude, just work :facepalm:
http.listen(8080, () => {
    console.log('SOCKETIO SERVER LISTENING!');
})

io.on('connection', socket => {
    socket.on('editPasteEmit', code => {
        io.emit('getEditPasteEmit', code);
    })
})

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(3000, () => console.log('Running on 3000'));
