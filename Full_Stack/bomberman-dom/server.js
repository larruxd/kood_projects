// required modules
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// create an express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

// constants and variables
let waitingTimer, startGameTimer, cells;
let gameStarted = false;
let choiceOfMap = [];

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// listen for incoming connections
io.on('connection', (socket) => handleConnection(socket));

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});

function handleConnection(socket) {
  // New user connected
  socket.on('newuser', (username) => handleNewUser(socket, username));

  // User disconnected
  socket.on('exituser', (username) => handleUserDisconnect(socket, username));

  // other events
  socket.on('generate-map', (mapCells) => handleGenerateMap(mapCells));
  socket.on('player-movement', (movingObj) => handlePlayerMovement(movingObj));
  socket.on('drop-bomb', (movingObj) => handleDropBomb(movingObj));
  socket.on('chat', (message) => handleChat(socket, message));
  socket.on('update-cells', (updatedCells) => handleUpdateCells(updatedCells));
  socket.on('place-power-up', (powerUp) => handlePlacePowerUp(powerUp));
  socket.on('power-picked-up', (powerUp) => handlePowerPickedUp(socket, powerUp));
  socket.on('player-killed', (playerKilledObj) => handlePlayerKilled(playerKilledObj));
  socket.on('cannot-drop-bomb', (count) => handleCannotDropBomb(socket, count));
  socket.on('game-over', (aliveCount) => handleGameOver(aliveCount));
  socket.on('disconnect', (reason) => handleDisconnect(socket, reason));
}

function handleNewUser(socket, username) {
  if (io.sockets.sockets.size <= 4) {
    if (startGameTimer || gameStarted) {
      socket.emit('connection-limit-reached', 'Game Currently In Session');
      socket.disconnect(true);
    } else {
      const connectedSockets = io.sockets.sockets;
      socket.username = username;
      socket.playerCount = findPlayerCount();
      userObj = { username: socket.username, count: socket.playerCount };
      socket.broadcast.emit('waiting', userObj);

      if (io.sockets.sockets.size >= 2 && io.sockets.sockets.size < 4 && !waitingTimer) {
        // Start countdown when there are two or more connections and countdown is not already running
        startCountdown();
      }
      if (io.sockets.sockets.size === 4 && !startGameTimer) {
        stopCountdown();
        startGameCountdown();
      }

      connectedSockets.forEach((connected) => {
        const previouslyJoinedSocket = { username: connected.username, count: connected.playerCount };
        socket.emit('join-lobby', previouslyJoinedSocket);
      });
      socket.broadcast.emit('update', username + ' joined the conversation');
    }
  } else {
    socket.emit('connection-limit-reached', 'Lobby is now full! Please Try Again Later');
    socket.disconnect(true);
  }
}

function handleUserDisconnect(socket, username) {
  console.log('User', username, 'disconnected');

  socket.broadcast.emit('update', username + ' left the conversation');
  socket.disconnect(true);
  socket.broadcast.emit('remove-waiting-player', socket.playerCount);
  io.sockets.sockets.delete(socket.id);
  if (io.sockets.sockets.size < 2 && waitingTimer) {
    stopCountdown();
  }
  if (io.sockets.sockets.size < 2 && startGameTimer) {
    stopGameCountdown();
  }
}

function handleGenerateMap(mapCells) {
  choiceOfMap.push(mapCells);
}

function handlePlayerMovement(movingObj) {
  io.sockets.emit('player-moving', movingObj);
}

function handleDropBomb(movingObj) {
  io.sockets.emit('bomb-dropped', movingObj);
}

function handleChat(socket, message) {
  socket.broadcast.emit('chat', message);
}

function handleUpdateCells(updatedCells) {
  cells = updatedCells;
}

function handlePlacePowerUp(powerUp) {
  io.sockets.emit('drop-power-up', powerUp);
}

function handlePowerPickedUp(socket, powerUp) {
  io.sockets.emit('remove-power-up', powerUp);
  io.sockets.emit('game-update', { event: 'power-up', username: socket.username, 'power-up': powerUp.powerUp });
}

function handlePlayerKilled(playerKilledObj) {
  io.sockets.emit('game-update', { event: 'player-killed', playerKilled: playerKilledObj.playerKilled, bomber: playerKilledObj.bomber });
  io.sockets.emit('player-death', playerKilledObj);
}

function handleCannotDropBomb(socket, count) {
  socket.emit('game-update', { event: 'cannot-drop-bomb', playerCount: count });
}

function handleGameOver(aliveCount) {
  if (aliveCount.length == 1 && gameStarted) {
    // one player remaining
    io.sockets.emit('end-game', { event: 'winner', playerNum: aliveCount[0].playerNum, name: aliveCount[0].name });
  }
  if (aliveCount.length == 0 && gameStarted) {
    // draw no winner
    io.sockets.emit('end-game', { event: 'draw' });
  }
}

function handleDisconnect(socket, reason) {
  if (socket.username != undefined) {
    socket.broadcast.emit('update', socket.username + ' has left the conversation');
  }
  // if the length of connections=1, that player wins, send out game over with winner
  if (io.sockets.sockets.size < 2 && waitingTimer) {
    stopCountdown();
  } else if (io.sockets.sockets.size < 2 && startGameTimer) {
    stopGameCountdown();
  }
  socket.broadcast.emit('remove-waiting-player', socket.playerCount);
  if (gameStarted && socket.playerCount != undefined) {
    socket.broadcast.emit('remove-player', socket.playerCount);
  }

  if (io.sockets.sockets.size == 0 && gameStarted) {
    gameStarted = false;
  }
}

function startGameCountdown() {
  let countdown = 10; //Change Time here
  cells = choiceOfMap[Math.floor(Math.random() * choiceOfMap.length)];
  let allPlayers = [];
  io.sockets.sockets.forEach((connected) => {
    allPlayers.push({ username: connected.username, count: connected.playerCount });
  });
  function emitGameCountdown() {
    io.sockets.emit('start-game-countdown', countdown);

    if (countdown > 0) {
      countdown--;
      startGameTimer = setTimeout(emitGameCountdown, 1000);
    } else {
      startGameTimer = null;
      io.sockets.emit('start-game', { cells, allPlayers });
      gameStarted = true;
    }
  }
  emitGameCountdown();
}

function stopGameCountdown() {
  clearTimeout(startGameTimer);
  startGameTimer = null;
  io.sockets.emit('start-game-countdown', 0);
}

function startCountdown() {
  let countdown = 20; //Change Time here

  function emitCountdown() {
    io.sockets.emit('waiting-countdown', countdown);

    if (countdown > 0) {
      countdown--;
      waitingTimer = setTimeout(emitCountdown, 1000);
    } else {
      waitingTimer = null;
      startGameCountdown();
    }
  }

  emitCountdown();
}

function stopCountdown() {
  clearTimeout(waitingTimer);
  waitingTimer = null;
  io.sockets.emit('waiting-countdown', 0);
}

function findPlayerCount() {
  let smallestMissingValue = null;
  for (let n = 1; n <= 4; n++) {
    let found = false;

    for (let [id, socket] of io.sockets.sockets) {
      if (socket.playerCount === n) {
        found = true;
        break;
      }
    }

    if (!found) {
      smallestMissingValue = n;
      break;
    }
  }

  return smallestMissingValue;
}
