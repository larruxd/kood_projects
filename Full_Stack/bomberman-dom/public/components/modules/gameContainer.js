import MINI from '/framework/mini.js';
import { globalSettings } from '/components/modules/gameSettings.js';
import { waitingRoomGrid } from '/components/modules/waitingRoom.js';
import { chatroom } from '/components/modules/chatroom.js';
import { hearts } from '/components/modules/gameState.js';
import { createMusicPlayer } from '/components/modules/musicplayer.js';

// -- Live updates of current game events -- //
export const gameUpdatesContainer = MINI.tag.div(
  { class: 'game-updates-container' },
  {},
  {},
  MINI.tag.h3({ class: 'game-updates-title' }, {}, {}, 'GAME UPDATES:'),
  MINI.tag.div({ class: 'live-updates' }, {}, {})
);

// -- Chatroom Container -- //
export const chatroomContainer = MINI.tag.div({ class: 'chatroom-container' }, {}, {}, chatroom);

//-- Waiting room -- //
export const waitingRoom = MINI.tag.div(
  {
    class: 'waiting-rooms-container',
    style: {
      display: 'block',
    },
  },
  {},
  {},
  waitingRoomGrid
);

// -- Power Up Container -- //
export const powerUpsContainer = MINI.tag.div(
  { class: 'power-up-container' },
  {},
  {},
  MINI.tag.h3({ class: 'power-up-title' }, {}, {}, 'Power-Ups:'),
  MINI.tag.div(
    { class: 'power-up-speed-icon' },
    {},
    {},
    MINI.tag.p({ class: 'key' }, {}, {}, 's'),
    MINI.tag.img({}, {}, { src: globalSettings['power-ups']['speed'] }),
    MINI.tag.p({ class: 'speed-amount' }, {}, {}, '0')
  ),
  MINI.tag.div(
    { class: 'power-up-flames-icon' },
    {},
    {},
    MINI.tag.p({ class: 'key' }, {}, {}, 'a'),
    MINI.tag.img({}, {}, { src: globalSettings['power-ups']['flames'] }),
    MINI.tag.p({ class: 'flames-amount' }, {}, {}, '0')
  ),
  MINI.tag.div(
    { class: 'power-up-bombs-icon' },
    {},
    {},
    MINI.tag.p({ class: 'key' }, {}, {}, 'd'),
    MINI.tag.img({}, {}, { src: globalSettings['power-ups']['bombs'] }),
    MINI.tag.p({ class: 'bombs-amount' }, {}, {}, '0')
  )
);

// -- game title -- //
const gameTitle = MINI.tag.h1({ class: 'game-title' }, {}, {}, 'BOMBERMAN');

// -- game container -- //
const gameContainer = MINI.tag.div({ class: 'game-container' }, {}, {});

// -- Congratulations Container -- //
export const congratulationsContainer = MINI.tag.div({ class: 'congratulations-container hidden' }, {}, {});

// -- grid layout -- //
export const layoutContainer = () => {
  return MINI.tag.div(
    {
      class: 'container',
      style: {
        'grid-template-columns': `${globalSettings.gridColumn1}px ${globalSettings.gridColumn2}px ${globalSettings.gridColumn3}px`,
        'grid-template-rows': `60px 60px ${globalSettings.gridFr}px ${globalSettings.gridFr}px`,
      },
    },
    {},
    {},
    createMusicPlayer(MINI),
    gameTitle,
    gameContainer,
    hearts(3),
    powerUpsContainer,
    //chatroomContainer,
    gameUpdatesContainer
  );
};
