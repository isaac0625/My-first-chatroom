var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http); 

var firebase = require("firebase/app");
var firebase_database = require("firebase/database");
var firebaseConfig = require('./firebaseServiceConfig');
var fbaseApp = firebase.initializeApp(firebaseConfig);
console.log("firebase app name: " + fbaseApp.name);
var firebaseDB = fbaseApp.database();
var ref_history = firebaseDB.ref('history');

function firebase_pushNewMsg(msg) {
    firebaseDB.ref('history').once('value').then(
        function(snapshot){
            var key = snapshot.numChildren();
            var data = {};
            data[key] = msg;
            ref_history.update(data);
        }
    );
}

app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    // io.emit('chat message', 'Someone has connected.');

    // for()
    firebaseDB.ref('history').once('value').then(
        function(snapshot){
            snapshot.forEach(function(snapshot_chatmessage){
                io.emit('load history', snapshot_chatmessage);
            });
        }
    );
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        firebase_pushNewMsg(msg);
    });

    socket.on('disconnect', function(){
        // io.emit('chat message', 'Someone has disconnected.');
    });
  });

http.listen(process.env.PORT || 5000,function(){
    console.log('listening on port 5000');
});