(function () {
    
    WinJS.UI.processAll().then(function () {
      
      var serverGame;
      var username, playerColor;
      var game, board;
      var usersOnline = [];
      socket = io();
           
      //////////////////////////////
      // Socket.io handlers
      ////////////////////////////// 
        // loadWorld()
        // createPlayer({playerId:'hey',x:1,y:0,z:1,r_x:0,r_y:0,r_z:0,sizeX:0.5,sizeY:0.5,sizeZ:0.5,speed:0.25,turnSpeed:0.08,playerColor:'red'})
        // addOtherPlayer({playerId:'ho',x:-1,y:0,z:1,r_x:0,r_y:0,r_z:0,sizeX:0.5,sizeY:0.5,sizeZ:0.5,speed:0.25,turnSpeed:0.08,playerColor:'blue'})
        // $('#page-login').hide();
        // $('#page-game').show();
      
      socket.on('login',function(msg) {
            usersOnline = msg.users;
            updateUserList()
      });
      
      socket.on('joinlobby', function (msg) {
        addUser(msg);
      });
      
       socket.on('leavelobby', function (msg) {
        removeUser(msg);
      });
           
      socket.on('updatePosition', function(data){
        updatePlayerPosition(data);
      });

      socket.on('updateObject', function(data){
        updateObject(data);
      });

      socket.on('joingame', function(msg) {
        console.log("joined as game id: " + msg.game.id );   
        playerColor = msg.color;

        // var gamename = getGameName(msg.player, msg.opponent)

        // objects[gamename] = [];
        
        loadWorld()
        createPlayer(msg.player);
        addOtherPlayer(msg.opponent)

        // var gameName = getGameName(playersId)
        // if (!dataBase[gameName]) {
        //   dataBase[gameName] = [];
        //   scene.children.forEach(mesh => dataBase[gameName].push(mesh))

        // }

        socket.emit('requestOldPlayers', {});
        
        $('#page-lobby').hide();
        $('#page-game').show();
        (function () {
        var thirtyconds = 30 * 10,
          display = document.querySelector('#time');
          startTimer(thirtyconds, display);
          printScore('red')
          printScore('blue')
        })()
      });
        
      socket.on('removeOtherPlayer', function(data){
        removeOtherPlayer(data);
    });
     
      
      socket.on('logout', function (msg) {
        removeUser(msg.userId);
      });
      

      
      //////////////////////////////
      // Menus
      ////////////////////////////// 
      $('#login').on('click', function() {
        username = $('#username').val();
        if (usersOnline.some(user => user === username)) {
          $('#warning').text('username is already exist')
          $('#warning').show()
        } else if (username.length > 8) {
          $('#warning').text('Maximum username length is 8')
          $('#warning').show()
        }
        else if (username.length > 0 && username.length<=8) {
            $('#userLabel').text(username);
            socket.emit('login', username);
            
            $('#warning').hide()
            $('#page-login').hide();
            $('#page-lobby').show();
        } 
      });

      $("#username").keyup(function(event){
        if(event.keyCode == 13){
            $("#login").click();
        }
      });

      $('#playagain').on('click', function() {
        // $('#page-lobby').show();
        // $('#page-game').hide();
        // $('#resultboard').hide();
        // username = $('#userLabel').text();
        objects = [];
        removeScene();
        $('canvas').remove();
        var canvas = document.getElementById('game-board');
        canvas.style.opacity = 1;
        document.querySelector('#time').textContent = '';
        socket.emit('playagain', username);
      });



      var addUser = function(userId) {
        usersOnline.push(userId);
        updateUserList();
      };
    
     var removeUser = function(userId) {
          for (var i=0; i<usersOnline.length; i++) {
            if (usersOnline[i] === userId) {
                usersOnline.splice(i, 1);
            }
         }
         
         updateUserList();
      };
      
      
      var updateUserList = function() {
        document.getElementById('userList').innerHTML = '';
        usersOnline.forEach(function(user) {
          $('#userList').append($('<button>')
            .text(user)
            .addClass('btn')
            .css({"width":"20%", "margin-right":'3%'})
            .on('click', function() {
              socket.emit('invite',  user);
            }));
        });
      };
           
    });

    function startTimer(duration, display) {
        var start = Date.now(),
            diff,
            seconds,
            millSec;
        function timer() {
            // get the number of millSec that have elapsed since 
            // startTimer() was called
            diff = duration - (((Date.now() - start) / 100) | 0);
            // does the same job as parseInt truncates the float
            seconds = (diff / 10) | 0;
            millSec = (diff % 10) | 0;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            var remaining = seconds + "." + millSec;

            display.textContent = $('#time').text() == '00.0' ? '00.0' : remaining
            if (diff <= 0 || $('#time').text() == '00.0') {
              display.textContent =  '00.0'

              var canvas = document.getElementById('game-board');
              canvas.style.opacity = 0.7
              var wincolor = $('#redScore').text() - $('#blueScore').text() > 0 ? 'red' : 'blue';
              console.log($('#redScore').text(), $('#blueScore').text())
              var winner = playersId.filter(elem => elem.playerColor === wincolor)[0]
              console.log(winner)
              var message = playerData.playerId === winner.playerId ? 'You win' : 'You lose'
             

              var div= $('#result')
              if ($('#redScore').text() === $('#blueScore').text()) {
                $('.winner').text('Draw')
              } else {
                $('.win').text('Winner')
                $('.winner').text(winner.playerId)
                $('.you').text(message)
              }

              $('#resultboard').show();
              clearInterval(timeinterval)
            }
        };
        // we don't want to wait a full second before the timer starts
        timer();
        var timeinterval = setInterval(timer, 100);
    }

    function printScore(color, display) {
        
        function result() {
        var score = 0;


        // for (key in objects) {
        //   if (objects[key].colorName === color) {
        //     score += objects[key].point
        //   }
        // }
        objects.forEach(elem => {
          if (elem.colorName === color) {

            score += elem.point
          }
        })
        display = document.querySelector(`#count${color}`);

        var colorUser = playersId.filter(elem => elem.playerColor === color)[0].playerId

        document.querySelector(`#${color}Id`).textContent = colorUser+ ': ';
        document.querySelector(`#${color}Score`).textContent = score




        if (document.querySelector('#time').textContent == '00.0') {
              clearInterval(scoreinterval)
          }
        };
        // we don't want to wait a full second before the result starts
        result();
        var scoreinterval = setInterval(result, 100);
    }

    

})();

