var app = require('express')(); //import library 'express'
var http = require('http').createServer(app); //import library 'http'

app.get('/', function(req, res){
    res.send('<h1>Hello, World!</h1>');
});

http.listen(3000,function(){
    console.log('listening on port 3000');
});