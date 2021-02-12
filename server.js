const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const fs = require('fs');
const passport = require('passport');
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const MongoStore = require('connect-mongo')(session);
const CrawlerDetect = require('crawler-detect');
require('dotenv').config();

// Middleware
const checkAuthenticated = require('./middleware/checkAuthenticated');

// Database
mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@users.vc1kj.mongodb.net/USERS?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return err;
    console.log('CONNECTED DATABASE ;P');
})

// Utilities
const apiLimiter = require('./utilities/apiLimiter');
require('./utilities/autoDelete');

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

// Routes
const indexRouter = require('./routes/indexRouter');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const accountRouter = require('./routes/accountRouter');
const authRouter = require('./routes/authRouter');
const apiRouter = require('./routes/apiRouter');
const rawRouter = require('./routes/rawRouter');
const compareRouter = require('./routes/compareRouter');
const pasteRouter = require('./routes/pasteRouter');

// Initialize the routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
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

app.listen(3000, () => console.log('Running on 3000!'));
