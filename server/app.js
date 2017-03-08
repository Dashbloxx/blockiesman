var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var world = require('../js/server');
var resolve = require('path').resolve;

var lobbyUsers = {};
var users = {};
var activeGames = {};

app
  .use(express.static(resolve(__dirname, '..', 'public')))
  .use(express.static(resolve(__dirname, '..', 'dashboard')))
  .use(express.static(resolve(__dirname, '..', 'js')))
  .use(express.static(resolve(__dirname, '..', 'node_modules/three/examples')))
  .use(express.static(resolve(__dirname, '..', 'node_modules/bootstrap/dist/css')))


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, '..', 'public', 'index.html'));
});

app.get('/js/client.js', (req, res) => {
  res.sendFile(resolve(__dirname, '..', 'js/client.js'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('login', function(userId) {
      console.log(userId + ' joining lobby');
      socket.userId = userId;  
   
      if (!users[userId]) {    
          console.log('creating new user');
          users[userId] = {userId: socket.userId, games:{}};
          socket.emit('login', {users: Object.keys(lobbyUsers)});
          lobbyUsers[userId] = socket;

          socket.broadcast.emit('joinlobby', socket.userId);
      }
    });

    socket.on('playagain', function(userId) {
      socket.emit('login', {users: Object.keys(lobbyUsers)});
      lobbyUsers[userId] = socket;
      socket.broadcast.emit('joinlobby', socket.userId);

    });

    socket.on('invite', function(opponentId) {
        console.log('got an invite from: ' + socket.userId + ' --> ' + opponentId);
        
        socket.broadcast.emit('leavelobby', socket.userId);
        socket.broadcast.emit('leavelobby', opponentId);
      
       
        var game = {
            id: Math.floor((Math.random() * 1000) + 1),
            board: null, 
            users: {red: socket.userId, blue: opponentId}
        };
        socket.gameId = game.id;
        activeGames[game.id] = game;
        
        // users[game.users.red].games[game.id] = game.id;
        // users[game.users.blue].games[game.id] = game.id;
  
        player1 = world.addPlayer(socket.userId, 'red');
        player2 = world.addPlayer(opponentId, 'blue');

        console.log('starting game: ' + game.id);
        lobbyUsers[game.users.red] && lobbyUsers[game.users.red].emit('joingame', {game: game, color: 'red', player: player1, opponent: player2});
        lobbyUsers[game.users.blue] && lobbyUsers[game.users.blue].emit('joingame', {game: game, color: 'blue', player: player2, opponent: player1});

        delete lobbyUsers[game.users.red];
        delete lobbyUsers[game.users.blue];   

    });

    socket.on('updatePosition', (data) => {
        var newData = world.updatePlayerData(data);
        socket.broadcast.emit('updatePosition', newData);
    });
    
    socket.on('disconnect', function(msg) {
              
      if (socket && socket.userId && socket.gameId) {
        console.log(socket.userId + ' disconnected');
        console.log(socket.gameId + ' disconnected');
      }
      
      delete lobbyUsers[socket.userId];
      delete users[socket.userId];
      
      
      socket.broadcast.emit('logout', {
        userId: socket.userId,
        gameId: socket.gameId
      });
      
      io.emit('removeOtherPlayer', socket.userId);
      world.removePlayer( socket.userId );

    });

    socket.on('updateObjectData', (data) => {
      socket.broadcast.emit('updateObject', data);
    });

});


// Handle environment changes
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

// var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
// var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 
// http.listen(port, ip_address, function(){
//     console.log( "Listening on " + ip_address + ", server_port " + port );
// });

