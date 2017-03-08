var container, scene, camera, renderer, raycaster, objects=[];
var plane;
var keyState = {};
var selectedObj;
var sphere;
var mouse, isShiftDown = false;
var particleMaterial;

var player, otherPlayer, playerId, moveSpeed, turnSpeed;

var playerData;

var players = [],
	playersId = [];

// var dataBase = {};

function getGameName (pass) {
	var playerUser = pass[0]
	var opponentUser = pass[1]
	if (!playerUser || !opponentUser) return null;
	return playerUser.playerId > opponentUser.playerId ? playerUser.playerId + opponentUser.playerId : opponentUser.playerId + playerUser.playerId
}

function loadWorld () {
	
	init();
	animate();


	function init () {

		//Setup------------------------------------------
		gameboard = document.getElementById('game-board');

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
		camera.position.set(0, 0,0);
		// camera.lookAt(new THREE.Vector3());

		scene = new THREE.Scene();

		// Grid

		var size = 20, step = 0.5;

		var geometry = new THREE.Geometry();

		for (var i = -size; i <= size; i += step) {

			geometry.vertices.push(new THREE.Vector3(-size, 0, i));
			geometry.vertices.push(new THREE.Vector3(size, 0, i));

			geometry.vertices.push(new THREE.Vector3(i, 0, -size));
			geometry.vertices.push(new THREE.Vector3(i, 0, size));

		}

		var material = new THREE.LineBasicMaterial({
			color: 0x000000,
			opacity: 0.2
		});

		var line = new THREE.LineSegments(geometry, material);
		scene.add(line);

		//

		// Lights

		scene.add( new THREE.AmbientLight( 0x505050 ) );

		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set( 1, 1, 1 ).normalize();
		scene.add(directionalLight);

		var light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 500, 2000 );
				light.castShadow = true;
				light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
				light.shadow.bias = - 0.00022;
				light.shadow.mapSize.width = 2048;
				light.shadow.mapSize.height = 2048;
				scene.add( light );

		//

		//Sphere
		// for (var i = 2; i < 14; i += 3) {
		// 	for (var j = 2; j < 14; j += 3) {
		// 		console.log([(i-2)*(j-2) + (j-2)])

				
		// 	}
		// }
	


//Sphere
		for (var i = 2; i < 14; i += 3) {
			for (var j = 2; j < 14; j += 3) {
				// var oct_geometry = new THREE.SphereGeometry(0.5, 16);
				var oct_geometry = new THREE.OctahedronGeometry(0.7);
				var oct_material = new THREE.MeshLambertMaterial( {
					reflectivity: 0.5,
					shading: THREE.FlatShading,
				} );

				oct = new THREE.Mesh(oct_geometry, oct_material);
				if ((i + j) % 2 == 1 ) {
					oct.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
					oct.colorName = 'blue'
				}
				else {
					oct.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
					oct.colorName = 'red'
				}

				oct.position.x = (i)*2 - 10;
				oct.position.z = (j)*2 - 10;

				scene.add(oct);
				oct.point = 3;
				objects.push(oct)
			}
		}
	


		// Cubes
		for (var i = 0; i < 14; i++) {
			for (var j = 0; j < 14; j++) {
				if (!((i+1)%3 === 0 && (j+1) % 3 === 0)) {


				
				var box_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
				// var color = new THREE.Color(i, 0, j)
				// var color = i < 5 ? new THREE.Color().setHSL( 0.6, 0.7, 0.6 ) : new THREE.Color().setHSL( 0.0, 0.7, 0.6 )
				var box_material = new THREE.MeshLambertMaterial( {
					reflectivity: 0.5,
					shading: THREE.FlatShading,
				} );

				box = new THREE.Mesh(box_geometry, box_material);
				
				if ((i + j) % 2 == 1 ) {
					box.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
					box.colorName = 'blue'
				}
				else {
					box.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
					box.colorName = 'red'
				}

				box.position.x = i*2 - 10;
				box.position.z = j*2 - 10;

				scene.add(box);
				box.point = 1;
				objects.push(box)
			}
			}
			selectedObj = objects[0];
		}



		// // meshs
		// var mesh
		// console.log(objects)
		// for (var i = 0; i < 14; i++) {
		// 	for (var j = 0; j < 14; j++) {
		// 		mesh = objects[`${i}${j}`]
		// 		count = [];
		// 		if (mesh) {
		// 			if ( (i + j) % 2 == 1  ) {
		// 				mesh.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
		// 				mesh.colorName = 'blue'
		// 			} else {
		// 				mesh.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
		// 				mesh.colorName = 'red'
		// 			}
		// 		} else {
		// 			if (!((i+1)%3 === 0 && (j+1) % 3 === 0)) {
		// 				var mesh_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
		// 				var mesh_material = new THREE.MeshLambertMaterial( {
		// 					reflectivity: 0.5,
		// 					shading: THREE.FlatShading,
		// 				} );

		// 				mesh = new THREE.Mesh(mesh_geometry, mesh_material);
						
		// 				if ((i + j) % 2 == 1 ) {
		// 					mesh.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
		// 					mesh.colorName = 'blue'
		// 				}
		// 				else {
		// 					mesh.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
		// 					mesh.colorName = 'red'
		// 				}
		// 				mesh.point = 1;
		// 				count.push(i + '' + j)
		// 			} else {
		// 				var mesh_geometry = new THREE.OctahedronGeometry(0.7);
		// 				var mesh_material = new THREE.MeshLambertMaterial( {
		// 					reflectivity: 0.5,
		// 					shading: THREE.FlatShading,
		// 				} );

		// 				mesh = new THREE.Mesh(mesh_geometry, mesh_material);
		// 				if ((i + j) % 2 == 1 ) {
		// 					mesh.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
		// 					mesh.colorName = 'blue'
		// 				}
		// 				else {
		// 					mesh.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
		// 					mesh.colorName = 'red'
		// 				}
		// 				mesh.point = 5;
		// 				count.push(i + '' + j)
		// 			}
		// 		mesh.ij = `${i}${j}`
		// 		objects[`${i}${j}`]= mesh 
		// 		}

		// 		mesh.position.x = i*2 - 10;
		// 		mesh.position.z = j*2 - 10;
		// 		scene.add(mesh);
		// 	}
		// 	selectedObj = objects['00'];
		// }
		// //

		// render

		// renderer = new THREE.WebGLRenderer({ alpha: true });
		// renderer.setSize(window.innerWidth, window.innerHeight);


		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0x444444);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();



		//Events------------------------------------------
		// document.addEventListener('click', onMouseClick, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mouseout', onMouseOut, false);
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
		window.addEventListener('resize', onWindowResize, false);

		//Final touches-----------------------------------
		gameboard.appendChild(renderer.domElement);
		
		// document.getElementById('page-game').insertBefore
		// gameboard, document.getElementById('scoreboard'))

	}

	function animate () {
		if (document.querySelector('#time').textContent == '00.0')  return null
		requestAnimationFrame(animate);
		render();
	}

	function render () {
		if (player) {

			updateCameraPosition();

			checkKeyStates();
			// checkSelectedObj();

			// TWEEN.update();

			camera.lookAt(player.position);
		}
		//Render Scene---------------------------------------
		renderer.clear();
		renderer.render(scene, camera);
	}

	function onMouseDown (event) {
		
		event.preventDefault();
		if (document.querySelector('#time').textContent == '00.0') return null;
		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( objects );

		if ( intersects.length > 0 ) {
			selectedObj = intersects[ 0 ].object
			var newColorName
			if (selectedObj.colorName === 'blue') {
				selectedObj.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
				selectedObj.colorName = 'red'
				newColorName = 'red'
			} else if (selectedObj.colorName === 'red') {
				selectedObj.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
				selectedObj.colorName = 'blue'
				newColorName = 'blue'
			}
			// new TWEEN.Tween( selectedObj.position ).to( {
			// 	x: mouse.x + Math.random() * 8,
			// 	z: mouse.y + Math.random() * 8
			// }, 200 )
			// .easing( TWEEN.Easing.Elastic.Out).start();
			socket.emit('updateObjectData', {id: selectedObj.id, colorName: selectedObj.colorName, playersId: playersId, index: selectedObj.ij});
		}
	}
	function onMouseUp () {
		
	}
	function onMouseMove () {

	}
	function onMouseOut () {

	}
	function onKeyDown (event) {
		keyState[event.keyCode || event.which] = true;
	}
	function onKeyUp (event) {

		//event = event || window.event;

		keyState[event.keyCode || event.which] = false;

	}
	function onWindowResize () {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
		render();
	}
	function calculateIntersects (event) {

		//Determine objects intersected by raycaster
		event.preventDefault();

		var vector = new THREE.Vector3();
		vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
		vector.unproject(camera);

		raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

		var intersects = raycaster.intersectObjects( objects);

		return intersects;
	}
}


function createPlayer (data) {

	playerData = data;

	var mesh_geometry = new THREE.BoxGeometry(data.sizeX/2, data.sizeY/2, data.sizeZ/2);
	// var mesh_geometry = new THREE.SphereGeometry(0.2, 32, 16);
	var mesh_material = new THREE.MeshLambertMaterial({
		vertexColors: THREE.VertexColors, 
		overdraw: 0.5
	});
	player = new THREE.Mesh(mesh_geometry, mesh_material);

	if(data.playerColor === 'blue') {
		player.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
	}	else {
		player.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
	}

		player.rotation.set(0, 0, 0);

		player.position.x = data.x;
		player.position.y = data.y;
		player.position.z = data.z;

		playerId = data.playerId;
		moveSpeed = data.speed;
		turnSpeed = data.turnSpeed;


	updateCameraPosition();

	scene.add(player);
	playersId.push({playerId: data.playerId, playerColor: data.playerColor});
	players.push(player);

	camera.lookAt(player.position);
};

function updateCameraPosition () {

	camera.position.x = player.position.x + 6 * Math.sin(player.rotation.y);
	camera.position.y = player.position.y + 6;
	camera.position.z = player.position.z + 6 * Math.cos(player.rotation.y);

};


function updateObject (data) {

	if (getGameName(playersId) !== getGameName(data.playersId)) return null
	var someObject = objectForId(data.id);
	// var someObject = objectFordb(data.playersId, data.id)
	if (someObject) {
		if (someObject.colorName === 'blue') {
			someObject.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
			someObject.colorName = 'red'
		} else if (someObject.colorName === 'red') {
			someObject.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
			someObject.colorName = 'blue'
		}
	}
};


function updatePlayerPosition (data) {
	var somePlayer = playerForId(data.playerId);

	if (somePlayer) {
	somePlayer.position.x = data.x;
	somePlayer.position.y = data.y;
	somePlayer.position.z = data.z;

	somePlayer.rotation.x = data.r_x;
	somePlayer.rotation.y = data.r_y;
	somePlayer.rotation.z = data.r_z;
	}
};

function updatePlayerData () {
	playerData.x = player.position.x;
	playerData.y = player.position.y;
	playerData.z = player.position.z;

	playerData.r_x = player.rotation.x;
	playerData.r_y = player.rotation.y;
	playerData.r_z = player.rotation.z;

};


function checkKeyStates () {
	if (keyState[38] || keyState[87]) {
		// up arrow or 'w' - move forward
		player.position.x -= moveSpeed * Math.sin(player.rotation.y);
		player.position.z -= moveSpeed * Math.cos(player.rotation.y);
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	}
	if (keyState[40] || keyState[83]) {
		// down arrow or 's' - move backward
		player.position.x += moveSpeed * Math.sin(player.rotation.y);
		player.position.z += moveSpeed * Math.cos(player.rotation.y);
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	}
	if (keyState[37] || keyState[65]) {
		// left arrow or 'a' - rotate left
		player.rotation.y += turnSpeed;
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	}
	if (keyState[39] || keyState[68]) {
		// right arrow or 'd' - rotate right
		player.rotation.y -= turnSpeed;
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	}
	if (keyState[81]) {
		// 'q' - strafe left
		player.position.x -= moveSpeed * Math.cos(player.rotation.y);
		player.position.z += moveSpeed * Math.sin(player.rotation.y);
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	}
	if (keyState[69]) {
		// 'e' - strage right
		player.position.x += moveSpeed * Math.cos(player.rotation.y);
		player.position.z -= moveSpeed * Math.sin(player.rotation.y);
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	}
};


function addOtherPlayer (data) {
	otherPlayer = data

	var mesh_geometry = new THREE.BoxGeometry(data.sizeX/2, data.sizeY/2, data.sizeZ/2);
	var mesh_material = new THREE.MeshLambertMaterial({
		vertexColors: THREE.VertexColors, 
		overdraw: 0.5
	});
	otherPlayer = new THREE.Mesh(mesh_geometry, mesh_material);

	if(data.playerColor === 'blue') {
		otherPlayer.material.color = new THREE.Color().setHSL( 0.6, 0.7, 0.6 );
	}	else {
		otherPlayer.material.color = new THREE.Color().setHSL( 0.0, 0.7, 0.6 );
	}

	otherPlayer.position.x = data.x;
	otherPlayer.position.y = data.y;
	otherPlayer.position.z = data.z;

	playersId.push({playerId: data.playerId, playerColor: data.playerColor});
	players.push(otherPlayer);
	// objects.otherPlayer = otherPlayer;
	scene.add(otherPlayer);

};

function removeOtherPlayer (data) {
	var resigned = playerForId(data)
	if (!resigned) return null;
	scene.remove(playerForId(data));
	$('#time').text('00.0')
};

function playerForId (id) {
	for (var i = 0; i < playersId.length; i++) {
		if (playersId[i].playerId == id) {
			return players[i];
		}
	}
};

function objectForId (id) {
	// return objects[id]
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].id == id) {
			return objects[i]			
		}
	}
};

// function objectFordb (passing, objId) {
// 	var thisGame = dataBase[getGameName(passing)]
// 	if (thisGame) {
// 		for (var i = 0; i < thisGame.length; i++) {
// 			if (thisGame[i].id == objId) {
// 				return thisGame[i]
// 			}
// 		}
// 	}
// };


function removeScene() {
	for (var i = scene.children.length - 1; i >= 0 ; i--) {
  var child = scene.children[ i ];
  scene.remove(child);
  }
}

