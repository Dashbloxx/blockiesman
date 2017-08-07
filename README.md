# Qubix

This is a a real-time multiplayer 3D browser game using Three.js and Socket.io.

[![qubix presentation video | YouTube](https://img.youtube.com/vi/Ow2GMddW66Y/0.jpg)](http://youtu.be/Ow2GMddW66Y)

You can try a [live demo](https://qubixgame.herokuapp.com/)

## Running Locally

### Run It

```sh
npm install
npm start
```

The above script will go through the following steps:
1. install npm dependencies
1. run the server

## Rule

### Prerequisite
You will need two players to play this game. Alternately, you can run the game with two different browers in the same computer.

### How are your clicking skills? 
Click your opponent's objects to change them to your color, but don't click the same object twice, or else you give it back to your opponent. Whoever has the most points after 30 seconds, wins.

**Objects:** 
- Box - 1 point 
- Diamond - 3 points

**Moves:**
- w/↑, a/←, s/↓, d/→

**Click:**
- Left-click to toggle colors



## Deploying to Heroku

All pushes to GitHub are being built.

[qubixgame.herokuapp.com](http://qubixgame.herokuapp.com)

