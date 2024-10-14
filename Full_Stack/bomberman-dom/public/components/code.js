import MINI from '/framework/mini.js';
import { globalSettings } from '/components/modules/gameSettings.js';
import { playerCard } from '/components/modules/waitingRoom.js';
import { movePlayers, placePlayer } from '/components/players.js';
import { changeStopValue, startAnimating } from '/components/script.js';
import { createMap, generateLevel } from '/components/modules/mapTemplate.js';
import { otherLivesContainer } from '/components/modules/gameState.js';
import { placePowerUp } from '/components/powerUps.js';
import { placeBombAndExplode } from '/components/bombs.js';

export let socket;
let uname;

export function runChatroom() {
  const app = document.querySelector('.app');

  // when the user presses join in the waiting room
  const joinUserButton = MINI.getObjByAttrsAndPropsVal(framework.obj, 'join-user');
  joinUserButton.setProp('onclick', function () {
    let username = app.querySelector('.join-screen #username').value;
    if (username.length == 0) {
      return;
    }
    socket = io();
    socket.emit('newuser', username);
    uname = username;
    runSocket();
  });

  // when the user the sends a message to the chatroom
  const sendMessageButton = MINI.getObjByAttrsAndPropsVal(framework.obj, 'send-message');
  sendMessageButton.setProp('onclick', function () {
    let message = app.querySelector('.chat-screen #message-input').value;
    if (message.length == 0) {
      return;
    }
    renderMessage('my', {
      username: uname,
      text: message,
    });
    socket.emit('chat', {
      username: uname,
      text: message,
    });
    app.querySelector('.chat-screen #message-input').value = '';
  });

  // when the user presses the exit button on the chatroom
  // const exitChatButton = MINI.getObjByAttrsAndPropsVal(framework.obj, 'exit-chat');
  // exitChatButton.setProp('onclick', function (evt) {
  //   evt.preventDefault();
  //   socket.emit('exituser', uname);
  //   socket.close();
  //   renderMessage('update', 'You have Left the conversation');
  // });

  function runSocket() {
    // socket event listeners
    socket.on('update', (update) => updateHandler(update));
    socket.on('waiting', (userObj) => waitingHandler(userObj));
    socket.on('join-lobby', (userObj) => joinLobbyHandler(userObj));
    socket.on('remove-waiting-player', (count) => removeWaitingPlayerHandler(count));
    socket.on('waiting-countdown', (countdown) => waitingCountdownHandler(countdown));
    socket.on('start-game-countdown', (countdown) => startGameCountdownHandler(countdown));
    socket.on('connection-limit-reached', (message) => connectionLimitRachedHandler(message));
    socket.on('start-game', (obj) => gameStartHandler(obj));
    socket.on('chat', (message) => renderMessage('other', message));
    socket.on('player-moving', (obj) => playerMoveHandler(obj));
    socket.on('remove-player', (userObj) => removePlayerHandler(userObj));
    socket.on('receive-cells', () => updateCellsHandler());
    socket.on('drop-power-up', (powerUpObj) => powerUpHandler(powerUpObj));
    socket.on('remove-power-up', (powerUp) => removePowerUpHandler(powerUp));
    socket.on('player-death', (playerKilledObj) => playerDeathHandler(playerKilledObj));
    socket.on('bomb-dropped', (moving) => bombDropHandler(moving));
    socket.on('game-update', (message) => gameUpdateHandler(message));
    socket.on('end-game', (winner) => endGameHandler(winner));
  }

  // send update message to chatroom
  function updateHandler(update) {
    renderMessage('update', update);
  }

  // adds recently joined player-card to the waiting room
  function waitingHandler(userObj) {
    MINI.getObjByAttrsAndPropsVal(framework.obj, 'players-waiting-container').setChild(playerCard(userObj));
    updatePlayerFrameWork(userObj);
    document.querySelector('.players-waiting-counter').innerHTML = Object.keys(framework.players).length;
    document.querySelector('.chatroom-container2').setAttribute('style', 'display: block');
  }

  // adds player-card to the lobby
  function joinLobbyHandler(userObj) {
    if (Object.keys(userObj).length != 0)
      if (userObj.username == uname) {
        socket.username = uname;
        socket.playerCount = userObj.count;
      }
    MINI.getObjByAttrsAndPropsVal(framework.obj, 'join-screen').removeAttr('class', 'active', '');
    MINI.getObjByAttrsAndPropsVal(framework.obj, 'chat-screen').setAttr('class', 'active');
    renderMessage('update', userObj.username + ' joined the conversation');
    MINI.getObjByAttrsAndPropsVal(framework.obj, 'players-waiting-container').setChild(playerCard(userObj));
    const cells = generateLevel();
    socket.emit('generate-map', cells);
    updatePlayerFrameWork(userObj);
    document.querySelector('.players-waiting-counter').innerHTML = Object.keys(framework.players).length;
    document.querySelector('.chatroom-container2').setAttribute('style', 'display: block');
  }

  // removes player-card from the waiting room
  function removeWaitingPlayerHandler(count) {
    delete framework.players[count];
    document.querySelector(`.player-${count}-card`).remove();
    document.querySelector('.players-waiting-counter').innerHTML = Object.keys(framework.players).length;
  }

  // display 20s countdown when 2 or more users have joined the waiting room
  function waitingCountdownHandler(countdown) {
    const waitingCountdown = app.querySelector('.countdown');
    waitingCountdown.classList.add('waiting');
    if (countdown >= 10) {
      waitingCountdown.innerHTML = `00:${countdown}`;
    } else {
      waitingCountdown.innerHTML = `00:0${countdown}`;
    }
  }

  // display 10s countdown before game starts
  function startGameCountdownHandler(countdown) {
    const startGameCountdown = app.querySelector('.countdown');
    startGameCountdown.classList.remove('waiting');
    if (countdown >= 10) {
      startGameCountdown.innerHTML = `00:${countdown}`;
    } else {
      startGameCountdown.innerHTML = `00:0${countdown}`;
    }
  }

  // display message when lobby is full
  function connectionLimitRachedHandler(message) {
    const fullLobbyMessage = MINI.tag.p({ class: 'full-lobby-message' }, {}, {}, message);
    if (document.querySelector('.full-lobby-message') == null || document.querySelector('.full-lobby-message') == undefined) {
      MINI.getObjByAttrsAndPropsVal(framework.obj, 'form').setChild(fullLobbyMessage);
    }
    socket.emit('exituser', uname);
    socket.close();
  }

  // draw map with all connected players and start game
  function gameStartHandler(obj) {
    framework.cells = obj.cells;
    let map = createMap(obj.cells);
    let gameContainer = MINI.getObjByAttrsAndPropsVal(framework.obj, 'game-container');
    gameContainer.setChild(map);
    const gameWrapper = gameContainer.children[0];
    for (const player of obj.allPlayers) {
      switch (player.count) {
        case 1:
          gameWrapper.setChild(placePlayer(1, 'player1', player.username));
          break;
        case 2:
          gameWrapper.setChild(placePlayer(2, 'player2', player.username));
          break;
        case 3:
          gameWrapper.setChild(placePlayer(3, 'player3', player.username));
          break;
        case 4:
          gameWrapper.setChild(placePlayer(4, 'player4', player.username));
          break;
      }
    }
    // add player lives to the side
    let otherPlayers = obj.allPlayers.filter((player) => player.count != socket.playerCount);
    let container = MINI.getObjByAttrsAndPropsVal(framework.obj, 'container');
    let otherLivesContainerObj = otherLivesContainer(otherPlayers);
    container.setChild(otherLivesContainerObj);
    const waitingRoomContainer = MINI.getObjByAttrsAndPropsVal(framework.obj, 'waiting-rooms-container');
    waitingRoomContainer.removeAttr('style', '', { display: 'none' });
    let cont = document.querySelector('.container');
    let chat = document.querySelector('.chatroom-container2');
    chat.setAttribute('style', 'display: block');
    chat.setAttribute('style', 'height: 100%');
    cont.appendChild(chat);
    startAnimating(60);
  }

  function playerMoveHandler(obj) {
    for (let [key, value] of Object.entries(obj)) {
      if (key != 'myPlayerNum') {
        framework.players[obj.myPlayerNum][key] = value;
      }
    }
    movePlayers();
  }

  function removePlayerHandler(userObj) {
    delete framework.players[userObj.count];
    document.querySelector(`.player-${userObj.count}`).remove();
    document.querySelector(`#player-${userObj.count}-lives`).remove();
  }

  function updateCellsHandler() {
    socket.emit('update-cells', framework.cells);
  }

  function powerUpHandler(powerUpObj) {
    framework.cells[powerUpObj.powerUpCoords[0]][[powerUpObj.powerUpCoords[1]]] = globalSettings['power-ups']['types'][powerUpObj.powerUp];
    document.querySelector('.game-wrapper').appendChild(MINI.createNode(placePowerUp(powerUpObj)));
  }

  function removePowerUpHandler(powerUp) {
    framework.cells[powerUp['powerUpCoords'][0]][powerUp['powerUpCoords'][1]] = null;
    const removedPower = Array.from(document.querySelectorAll(`.${powerUp['powerUp']}`)).filter((ele) => {
      //if the co-ord has a decimal places then make it to 2dp.
      let eleTopDp = Math.pow(10, 0);
      if (ele.style.top.includes('.')) {
        eleTopDp = Math.pow(10, ele.style.top.split('.')[1].length - 2);
      }
      let eleLeftDp = Math.pow(10, 0);
      if (ele.style.left.includes('.')) {
        eleLeftDp = Math.pow(10, ele.style.left.split('.')[1].length - 2);
      }
      let top = Math.round(powerUp['powerUpCoords'][0] * globalSettings['power-ups']['height'] * eleTopDp) / eleTopDp;
      let left = Math.round(powerUp['powerUpCoords'][1] * globalSettings['power-ups']['width'] * eleLeftDp) / eleLeftDp;
      return (
        Math.round(parseFloat(ele.style.top) * eleTopDp) / eleTopDp === top &&
        Math.round(parseFloat(ele.style.left) * eleLeftDp) / eleLeftDp === left
      );
    });

    if (removedPower.length > 0) {
      removedPower.shift().remove();
    }
  }

  function playerDeathHandler(playerKilledObj) {
    let playerNumber = parseInt(playerKilledObj.playerKilled);
    let playerFrameWork = framework['players'][`${playerNumber}`];
    let playerDOM = document.querySelector(`.player-${playerNumber}`);
    // playerFrameWork.lives = 3;
    //reduce their live count from framework
    playerFrameWork.lives > 0 ? (playerFrameWork.lives -= 1) : (playerFrameWork.lives = 0);
    playerFrameWork.immune = true;
    playerDOM.classList.toggle('immune');
    setTimeout(() => {
      playerFrameWork.immune = false;
      playerDOM.classList.toggle('immune');
    }, 1500);
  }

  function bombDropHandler(moving) {
    //check if a player collided with an explosion
    placeBombAndExplode(moving)
      .then((res) => {
        setTimeout(() => {
          Array.from(document.querySelectorAll(`.player-${moving['myPlayerNum']}-explosion`)).forEach((el) => el.remove());
          if (
            framework['players'][moving['myPlayerNum']]['numOfBombs'] === 0 &&
            document.querySelector(`.player-${moving['myPlayerNum']}-bomb`) === null
          ) {
            framework['players'][moving['myPlayerNum']]['numOfBombs'] = 1;
          }
        }, 1000);
      })
      .catch((err) => {
        socket.emit('cannot-drop-bomb', moving['myPlayerNum']);
      });
  }

  function gameUpdateHandler(message) {
    let updateMessage;
    switch (message.event) {
      case 'power-up':
        updateMessage = MINI.createNode(
          MINI.tag.p(
            { class: 'live-updates-message' },
            {},
            {},
            `${message.username} elhamdulillah assembled ${message['power-up']} power-up ${
              globalSettings['power-ups']['types'][message['power-up']]
            }`
          )
        );
        break;
      case 'player-killed':
        let playerNumber = parseInt(message.playerKilled);
        let deathMessageArr = [
          `${framework['players'][`${playerNumber}`].name} became closer to Allah by  ${
            framework['players'][`${message.bomber}`].name
          }'s explosion`,
          `${framework['players'][`${playerNumber}`].name} Wasted by bro. ${framework['players'][`${message.bomber}`].name}`,
          `${framework['players'][`${playerNumber}`].name} has met Allah!! Thanks  ${framework['players'][`${message.bomber}`].name}`,
          `${framework['players'][`${message.bomber}`].name} Wasted by ${framework['players'][`${playerNumber}`].name}"`,
          `${framework['players'][`${playerNumber}`].name} tasted hell fire of ${framework['players'][`${message.bomber}`].name}`,
        ];
        let finalDeathMessage = `${framework['players'][`${message.bomber}`].name} has Wasted ${
          framework['players'][`${playerNumber}`].name
        }`;
        if (framework['players'][`${playerNumber}`].lives != 0) {
          updateMessage = MINI.createNode(
            MINI.tag.p({ class: 'live-updates-message' }, {}, {}, deathMessageArr[Math.floor(Math.random() * deathMessageArr.length)])
          );
        } else {
          updateMessage = MINI.createNode(MINI.tag.p({ class: 'live-updates-message' }, {}, {}, finalDeathMessage));
        }
        break;
      case 'cannot-drop-bomb':
        if (socket.playerCount == message.playerCount) {
          updateMessage = MINI.createNode(
            MINI.tag.p({ class: 'live-updates-message' }, {}, {}, 'Bro. enough Bombing. Vallahi you breake my game!')
          );
        } else {
          updateMessage = MINI.createNode(
            MINI.tag.p({ class: 'live-updates-message' }, {}, {}, 'Bro. tell other Hemar -Stop bomb spamming. Ya Gazma!')
          );
        }
        break;
      default:
        updateMessage = MINI.createNode(MINI.tag.p({ class: 'live-updates-message' }, {}, {}, `Unhandled game event: ${message.event}`));
        break;
    }
    appendLiveUpdateMessage(updateMessage);
  }

  function endGameHandler(winner) {
    function startTimer(duration, display) {
      var timer = duration,
        minutes,
        seconds;
      setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        display.textContent = minutes + ':' + seconds;

        if (--timer < 0) {
          // for refresh webpage
          window.location.reload();
          timer = duration;
        }
      }, 1000);
    }
    const congratulations = document.querySelector('.congratulations-container');
    if (congratulations.childElementCount == 0) {
      switch (winner.event) {
        case 'draw':
          congratulations.innerHTML += `
                <div class="wrapper">
                  <div class="modal modal--congratulations">
                    <div class="modal-top">
                      <img class="modal-icon u-imgResponsive" src="../assets/img/GameOver.gif" alt="Trophy" />
                      <div class="modal-header">All Wasted</div>
                      <div class="modal-subheader"> !!Try Better!!!</div>
                      <div class="modal-subheader">The window will reload in:</div>
                      <div class="end-timer"></div>
                    </div>
                  </div>
                </div>`;
          break;
        case 'winner':
          congratulations.innerHTML += `
                <div class="wrapper">
                  <div class="modal modal--congratulations">
                    <div class="modal-top">
                      <div class="modal-header">Congratulations ${winner.name} (player-${winner.playerNum})</div>
                      <img class="modal-icon u-imgResponsive" src="../assets/img/winner.gif" alt="Trophy" />
                      <div class="modal-subheader"> You are a good bomber!</div>
                      <div class="modal-subheader">The window will reload in:</div>
                      <div class="end-timer"></div>
                    </div>
                  </div>
                </div>`;
          break;
      }
    }
    changeStopValue();
    congratulations.classList.remove('hidden');
    startTimer(10, document.querySelector('.end-timer'));
  }

  function renderMessage(type, message) {
    let messageContainer = app.querySelector('.chat-screen .messages');
    if (type == 'my') {
      let el = document.createElement('div');
      el.setAttribute('class', 'message my-message');
      el.innerHTML = `
			<div>
				<div class="name">You</div>
				<div class="text">${message.text}</div>
			</div>
		`;
      messageContainer.appendChild(el);
    } else if (type == 'other') {
      let el = document.createElement('div');
      el.setAttribute('class', 'message other-message');
      el.innerHTML = `
			<div>
				<div class="name">${message.username}</div>
				<div class="text">${message.text}</div>
			</div>
		`;
      messageContainer.appendChild(el);
    } else if (type == 'update') {
      let el = document.createElement('div');
      el.setAttribute('class', 'update');
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    // scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
}

function updatePlayerFrameWork(userObj) {
  framework['players'][`${userObj['count']}`] = {
    name: userObj.username,
    _lives: 3, // Add the underlying property _lives to store the actual value
    'power-ups': [],
    speed: globalSettings.speed.normal,
    numOfBombs: 1,
    immune: false,
  };
  Object.defineProperty(framework['players'][`${userObj['count']}`], 'lives', {
    get: function () {
      return this._lives; // Return the value from the underlying property _lives
    },
    set: function (v) {
      let playerLives = document.querySelector(`#player-${userObj['count']}-lives`);
      this._lives = v; // Update the value of the underlying property _lives
      if (playerLives !== undefined && playerLives !== null) {
        const lifeElements = playerLives.children[0].children;
        if (this._lives < lifeElements.length && lifeElements.length > 0) {
          Array.from(lifeElements).shift().remove();
        } else if (this._lives > lifeElements.length && lifeElements.length > 0) {
          // Code to add new life elements if needed.
        } else {
          // Code to handle other cases or errors.
        }
      } else {
        let lives = Array.from(document.querySelector('.lives-container').children[0].children);
        if (lives.length > this._lives) {
          lives.shift().remove();
        }
      }
    },
  });

  // coordinates are [row][col]
  switch (userObj.count) {
    case 1:
      framework['players'][`${userObj['count']}`]['row'] = 1;
      framework['players'][`${userObj['count']}`]['col'] = 1;
      break;
    case 2:
      framework['players'][`${userObj['count']}`]['row'] = 1;
      framework['players'][`${userObj['count']}`]['col'] = 13;
      break;
    case 3:
      framework['players'][`${userObj['count']}`]['row'] = 11;
      framework['players'][`${userObj['count']}`]['col'] = 13;
      break;
    case 4:
      framework['players'][`${userObj['count']}`]['row'] = 11;
      framework['players'][`${userObj['count']}`]['col'] = 1;
      break;
  }
}

function appendLiveUpdateMessage(updateMessage) {
  let gameUpdatesContainer = document.querySelector('.live-updates');
  if (updateMessage && gameUpdatesContainer) {
    // Check if updateMessage is valid and gameUpdatesContainer is found
    if (gameUpdatesContainer.childNodes.length != 0) {
      gameUpdatesContainer.insertBefore(updateMessage, gameUpdatesContainer.firstChild);
    } else {
      gameUpdatesContainer.appendChild(updateMessage);
    }
  } else {
    console.error('Invalid updateMessage or gameUpdatesContainer not found', { updateMessage, gameUpdatesContainer });
  }
}
