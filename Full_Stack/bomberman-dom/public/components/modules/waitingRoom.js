import MINI from '/framework/mini.js';
import { globalSettings } from '/components/modules/gameSettings.js';
//import { createMusicPlayer } from '/components/modules/musicplayer.js';
import { chatroom } from '/components/modules/chatroom.js';

function imageBackground(number) {
  switch (number) {
    case 1:
      return MINI.tag.img({ class: 'player-1-cover-image' }, {}, { src: '/assets/img/whiteCover.jpg' });
    case 2:
      return MINI.tag.img(
        { class: 'player-1-cover-image' },
        {},
        {
          src: '/assets/img/blackcover.jpg',
        }
      );
    case 3:
      return MINI.tag.img(
        { class: 'player-1-cover-image' },
        {},
        {
          src: '/assets/img/bluecover.jpg',
        }
      );
    case 4:
      return MINI.tag.img(
        { class: 'player-1-cover-image' },
        {},
        {
          src: '/assets/img/yellowCover.jpg',
        }
      );
  }
}
function imageAvatar(number) {
  switch (number) {
    case 1:
      return MINI.tag.img({ class: 'player-1-character' }, {}, { src: globalSettings.players.player1 });
    case 2:
      return MINI.tag.img({ class: 'player-1-character' }, {}, { src: globalSettings.players.player2 });
    case 3:
      return MINI.tag.img({ class: 'player-1-character' }, {}, { src: globalSettings.players.player3 });
    case 4:
      return MINI.tag.img({ class: 'player-1-character' }, {}, { src: globalSettings.players.player4 });
  }
}

export const playerCard = (incomingPlayer) =>
  MINI.tag.div(
    { class: `player-${incomingPlayer.count}-card` },
    {},
    {},
    MINI.tag.div({ class: 'player-1-card-wrapper' }, {}, {}, imageBackground(incomingPlayer.count)),
    MINI.tag.span({ class: 'player-1-card-footer' }, {}, {}, MINI.tag.span({}, {}, {}, `${incomingPlayer.username}`), MINI.tag.span()),
    imageAvatar(incomingPlayer.count)
  );

export const waitingRoomGrid = MINI.tag.div(
  {
    class: 'waiting-rooms-grid',
    style: {
      'grid-template-columns': `${globalSettings.gridColumn1}px ${globalSettings.gridColumn2}px ${globalSettings.gridColumn3}px`,
      'grid-template-rows': `60px 60px ${globalSettings.gridFr}px ${globalSettings.gridFr}px`,
    },
  },
  {},
  {},
  MINI.tag.h1({ class: 'waiting-rooms-title' }, {}, {}, 'Wellcome to Bomberman'),
  MINI.tag.div({ class: 'countdown' }, {}, {}, '00:00'),
  MINI.tag.div(
    { class: 'waiting-rooms' },
    {},
    {},
    MINI.tag.div(
      { class: 'screen join-screen active' },
      {},
      {},
      MINI.tag.div(
        { class: 'form' },
        {},
        {},
        MINI.tag.h2({}, {}, {}, 'Join Here'),
        MINI.tag.div(
          { class: 'form-input' },
          {},
          {},
          MINI.tag.label({}, {}, {}, 'Username'),
          MINI.tag.input({ type: 'text', id: 'username' }, {}, { pattern: '^(?=\\s*\\S).{1,6}$', required: true }, 'Join Chatroom'),
          MINI.tag.p({}, {}, {}, 'Enter up to 6 Characters')
        ),
        MINI.tag.div({ class: 'form-input' }, {}, {}, MINI.tag.button({ id: 'join-user' }, {}, {}, 'Join'))
      )
    ),
    //ChatRoom
    MINI.tag.div({ class: 'chatroom-container2', style: { display: 'none' } }, {}, {}, chatroom),

    MINI.tag.div(
      { class: 'players-waiting-container' },
      {},
      {},
      MINI.tag.div(
        { class: 'counter-container' },
        {},
        {},
        MINI.tag.h3({ class: 'players-waiting-title' }, {}, {}, 'Players: '),
        MINI.tag.h3({ class: 'players-waiting-counter' }, {}, {})
      )
    )
  ),
  MINI.tag.div(
    { class: 'game-info-container' },
    {},
    {},
    MINI.tag.div(
      { class: 'synopsis-info' },
      {},
      {},
      MINI.tag.p(
        { class: 'synopsis-text' },
        {},
        {},
        `Bomberman, players take control of a character known as Bomberman, who is equipped with an arsenal of bombs.
        The objective is to navigate through maze-like levels, strategically placing bombs to destroy obstacles, defeat enemies
          `
      )
      //createMusicPlayer(MINI)
    ),
    MINI.tag.div(
      { class: 'game-controls-container' },
      {},
      {},
      MINI.tag.h3({ class: 'game-controls-title' }, {}, {}, 'Controls'),
      MINI.tag.div(
        { class: 'arrow-controls-info' },
        {},
        {},
        MINI.tag.img({ class: 'arrow-controls-image' }, {}, { src: '/assets/img/arrows.png' }),
        MINI.tag.p(
          { class: 'arrow-controls-text' },
          {},
          {},
          'To move the player character, use the arrow keys on your keyboard:',
          MINI.tag.br(),
          MINI.tag.br(),
          MINI.tag.ul(
            { class: 'arrow-controls-list' },
            {},
            {},
            MINI.tag.li({}, {}, {}, 'Left arrow key to move left.'),
            MINI.tag.li({}, {}, {}, 'Right arrow key to move right'),
            MINI.tag.li({}, {}, {}, 'Up arraow key to move up.'),
            MINI.tag.li({}, {}, {}, 'Down arrow key to move down.')
          )
        )
      ),
      MINI.tag.div(
        { class: 'bomb-controls-info' },
        {},
        {},
        MINI.tag.img({ class: 'bomb-controls-image' }, {}, { src: '/assets/img/wkey.png' }),
        MINI.tag.p({ class: 'bomb-controls-text' }, {}, {}, `W key to drop a bomb. Don't touch Explosion fire!`)
      ),
      MINI.tag.div(
        { class: 'pick-up-controls-info' },
        {},
        {},
        MINI.tag.img({ class: 'pick-up-controls-image' }, {}, { src: '/assets/img/qkey.png' }),
        MINI.tag.p({ class: 'pick-up-controls-text' }, {}, {}, 'Q key to pick up a power-up. Max 3!.')
      ),
      MINI.tag.div(
        { class: 'power-up-controls-info' },
        {},
        {},
        MINI.tag.img({ class: 'power-up-controls-image' }, {}, { src: '/assets/img/asd.png' }),
        MINI.tag.p(
          { class: 'power-up-controls-text' },
          {},
          {},
          'Press A,S,D keys to use Power Ups',
          MINI.tag.br(),
          MINI.tag.br(),
          MINI.tag.ul(
            { class: 'power-up-controls-list' },
            {},
            {},
            MINI.tag.li({}, {}, {}, ' A key to use the flames power-up.'),
            MINI.tag.li({}, {}, {}, ' S  key to use the speed power-up.'),
            MINI.tag.li({}, {}, {}, ' D key to use bombs power-up.')
          )
        )
      )
    ),
    MINI.tag.div(
      { class: 'game-extras-container' },
      {},
      {},
      MINI.tag.h3({ class: 'game-extras-title' }, {}, {}, 'Info'),
      MINI.tag.div(
        { class: 'synopsis-info' },
        {},
        {},
        MINI.tag.p(
          { class: 'bombs-text' },
          {},
          {},
          `20s countdown will start once 2 or more players join to the lobby. 
          More Players can join during 20s countdown.
          Once the countdown has ended or 4 players joined, the 10s countdown starts to get ready!`
        )
      ),
      MINI.tag.div({ class: 'speed-info' }, {}, {}, MINI.tag.p({ class: 'speed-text' }, {}, {}, 'There are 3 Power Ups:')),
      MINI.tag.div(
        { class: 'speed-info' },
        {},
        {},
        MINI.tag.img({ class: 'speed-image' }, {}, { src: globalSettings['power-ups']['speed'] }),
        MINI.tag.p({ class: 'speed-text' }, {}, {}, 'SPEED'),
        MINI.tag.p({ class: 'speed-text' }, {}, {}, '10s Double Movement Speed!')
      ),
      MINI.tag.div(
        { class: 'flames-info' },
        {},
        {},
        MINI.tag.img({ class: 'flames-image' }, {}, { src: globalSettings['power-ups']['flames'] }),
        MINI.tag.p({ class: 'flames-text' }, {}, {}, 'FLAMES'),
        MINI.tag.p({ class: 'flames-text' }, {}, {}, ' Increases explosion range 4 directions by 1 block.')
      ),
      MINI.tag.div(
        { class: 'bombs-info' },
        {},
        {},
        MINI.tag.img({ class: 'bombs-image' }, {}, { src: globalSettings['power-ups']['bombs'] }),
        MINI.tag.p({ class: 'bombs-text' }, {}, {}, 'BOMBS'),
        MINI.tag.p({ class: 'bombs-text' }, {}, {}, ' Increases bombs dropped at a time by 1.')
      ),
      MINI.tag.div(
        { class: 'speed-info' },
        {},
        {},
        MINI.tag.p(
          { class: 'speed-text' },
          {},
          {},
          `Power Ups must be activated! Do you remember A,S,D keys info?`,
          MINI.tag.br(),
          MINI.tag.ul(
            { class: 'arrow-controls-list' },
            {},
            {},
            MINI.tag.li({}, {}, {}, 'Range of explosion can upto a 4 block radius.'),
            MINI.tag.li({}, {}, {}, 'Bombs dropped can up to 4.')
          )
        )
      ),
      MINI.tag.div({ class: 'authors-info' }, {}, {}, MINI.tag.p({ class: 'authors-text' }, {}, {}, 'This game was created by:alpbal'))
    )
  )
);
