
var args = process.argv[0];
var io = require('socket.io-client');
var socket=io('http://localhost:3705');

//socket.emit('refreshImg', 'test 3 sent');
socket.emit('refreshImg', process.argv[2]);
setTimeout(function(){
  socket.disconnect();
}, 500);
//socket.disconnect();

socket.on('disconnect', function(){
  console.log('disconnected from socket server');
});
