var express = require('express');
var app = express();
var morgan = require('morgan');
var errorhandler = require('errorhandler');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var router = express.Router();
var request = require('request');

app.use(morgan('dev'));
app.use(errorhandler());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(cookieParser('mysecretcode'));

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port)
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.emit('news', 'Connected.');
    socket.on('request', function (data) {
        var options = {
            url: 'http://graph.facebook.com/' + data,
            headers: {
                'User-Agent': 'request'
            }
        };
        socket.emit('news', 'Requesting:' +  'http://graph.facebook.com/' + data);
        request(options, function(error, response, body) {
            console.log('requested');
            socket.emit('connected', body);
        });
    });
});
