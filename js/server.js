var players = [];

function Player(id, color){

    this.playerId = id;
    this.x = color === 'red' ? 1 : -1;
    this.y = 0;
    this.z = 1;
    this.r_x = 0;
    this.r_y = 0;
    this.r_z = 0;
    this.sizeX = 0.5;
    this.sizeY = 0.5;
    this.sizeZ = 0.5;
    this.speed = 0.25;
    this.turnSpeed = 0.08;
    this.playerColor = color;

}

var addPlayer = function(id, color){
    var player = new Player(id, color);
    players.push( player );

    return player;
};

var removePlayer = function(id) {
    var player = playerForId(id);
    var index = players.indexOf(player);

    if (index > -1) {
        players.splice(index, 1);
    }
};

var updatePlayerData = function(data){
    var player = playerForId(data.playerId);
    player.x = data.x;
    player.y = data.y;
    player.z = data.z;
    player.r_x = data.r_x;
    player.r_y = data.r_y;
    player.r_z = data.r_z;

    return player;
};

var playerForId = function(id){

    var player;
    for (var i = 0; i < players.length; i++){
        if (players[i].playerId === id){

            player = players[i];
            break;

        }
    }

    return player;
};

module.exports = { players, addPlayer, removePlayer, updatePlayerData, playerForId }