import { socket } from '/components/code.js';
import { PlayerMovement } from '/components/players.js';
import { gameOver } from '/components/lives.js';

export let currentLevel;

let stop = false;
let fps = 60,
  fpsInterval,
  startTime,
  now,
  then,
  elapsed;

export function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = window.performance.now();
  startTime = then;
  animate(fpsInterval);
}

function animate(newtime) {
  // stop
  if (stop) {
    return;
  }

  // request another frame

  let frame = requestAnimationFrame(animate);

  // calc elapsed time since last loop

  now = newtime;
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but...
    // Also, adjust for fpsInterval not being multiple of 16.67
    then = now - (elapsed % fpsInterval);

    // draw player movement
    if (socket != null) PlayerMovement(socket);
    gameOver(socket);
  }
}

export function changeStopValue() {
  stop = true;
}
