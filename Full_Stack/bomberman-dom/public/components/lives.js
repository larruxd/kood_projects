import { changeStopValue } from '/components/script.js';

let checkLives = false;
export function gameOver(socket) {
  const playersWithLives = [];
  for (let [playerNum, playerObj] of Object.entries(framework.players)) {
    if (playerObj._lives > 0) playersWithLives.push({ playerNum, name: playerObj.name });
  }
  if (!checkLives) {
    checkLives = true;
    socket.emit('game-over', playersWithLives);
    setTimeout(() => {
      checkLives = false;
    }, 67);
  }
}
