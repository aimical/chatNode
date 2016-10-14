var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var Controllers = require('./controllers');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var signedCookieParser = cookieParser('chatNode');

app.use(cookieParser());
var sessionStore = new MongoStore({
    url: 'mongodb://localhost/chatNode'
});
app.use(session({
    secret: 'chatNode',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000
    },
    store: sessionStore
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, '/static')));

var server = app.listen(port, function () {
    console.log('chatNode  is on port ' + port + '!')
});

//
app.get('/api/validate', function (req, res) {
    var userId = req.session.user;
    if (userId) {
        Controllers.findById(userId, function (err, user) {
            if (err) {
                return res.json(401, {msg: err})
            }
            res.json(user)
        })
    } else {
        res.status(500).end()
    }
});

app.post('/api/login', function (req, res) {
    var email = req.body.email;
    if (email) {
        Controllers.findByEmailOrCreate(email, function (err, user) {
            if (err) {
                return res.json(500, {msg: err})
            }
            req.session.user = user._id;
            res.json(user)
        })
    } else {
        res.status(500).end()
    }
});

app.get('/api/loginOut', function (req, res) {
    if (req.session.user) {
        req.session.user = null;
        res.status(200).end();
    }
});
//
app.use(function (req, res) {
    res.sendFile(path.join(__dirname, './static/index.html'))
});

var io = require('socket.io').listen(server);

var messages = [];

io.use(function (socket, next) {
    var handshakeData = socket.request;
    signedCookieParser(handshakeData, {}, function (err) {
        if (err) {
            return next(new Error(err.toString()))
        }
        sessionStore.get(handshakeData.signedCookies['connect.sid'], function (err, session) {
            if (err) {
                return next(new Error(err.message.toString()))
            }
            handshakeData.session = session;
            if (session.user) {
                return next()
            }
            next(new Error('no login!'))
        })
    })
});

io.sockets.on('connection', function (socket) {
    socket.on('getAllMessages', function () {
        socket.emit('allMessages', messages)
    });
    socket.on('createMessage', function (message) {
        messages.push(message);
        io.sockets.emit('addMessage', message)
    })
});
