var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [
    {name: 'Oni', message: 'Hi'},
    {name: 'Oye', message: 'Hello'}
]

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dburl = 'mongodb+srv://user:tQLVD3ziqYJGCdB@cluster0.upvla.mongodb.net/chatApp'

app.get('/messages', (req, res) => {
    res.send(messages);
})
app.post('/messages', (req, res) => {
    console.log(req.body);
    messages.push(req.body);
    io.emit('message', req.body);
    res.sendStatus(200);
})
io.on('connection', (socket) =>{
    console.log('a user connected');
})

mongoose.connect(dburl, { useUnifiedTopology: true , useNewUrlParser: true},(err) =>{
    console.log('mongo db connection', err)
})
var server = http.listen(3000, ()=> {
    console.log('server is listening on port', server.address().port)
})