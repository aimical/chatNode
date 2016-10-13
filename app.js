var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var Controllers = require('./controllers')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);

app.use(cookieParser('huang'));
app.use(session({
    secret: 'huang',
    store: new MongoStore({
        url: 'mongodb://localhost/chatNode',
        ttl:60*30
    })
}));
app.use(express.static(path.join(__dirname, '/static')));

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, './static/index.html'))
});

var server = app.listen(port, function () {
    console.log('TechNode  is on port ' + port + '!')
});

var io = require('socket.io').listen(server);

var messages = [];

io.sockets.on('connection', function (socket) {
    socket.on('getAllMessages', function () {
        socket.emit('allMessages', messages)
    });
    socket.on('createMessage', function (message) {
        messages.push(message);
        io.sockets.emit('addMessage', message)
    })
});

//
