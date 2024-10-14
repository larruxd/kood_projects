import MINI from '/framework/mini.js';

//    --- create the hearts (the remaining lives) for players  --- //
export const hearts = (livesRemaining) => {
  const heartImgSrc = '/assets/img/heart.gif';
  const heartImgObj = MINI.tag.img(
    {
      class: 'lives-hearts',
    },
    {},
    {
      src: heartImgSrc,
    }
  );

  const livesContainer = MINI.tag.div({ class: 'lives-container' }, {}, {}, 'LIVES: ');

  const livesImages = MINI.tag.div({ class: 'lives-heart-container' }, {}, {});
  for (let i = 0; i < Number(livesRemaining); i++) {
    livesImages.setChild(heartImgObj);
  }
  livesContainer.setChild(livesImages);
  return livesContainer;
};
// -- //

// -- number of players is based on the number of websockets -- //
export const otherLivesContainer = (allPlayersObj) => {
  const otherLivesContainer = MINI.tag.div(
    { class: 'other-lives-container' },
    {},
    {},
    MINI.tag.h2(
      {
        class: 'other-lives-title',
      },
      {},
      {},
      'ENEMIES:'
    )
  );
  for (const player of allPlayersObj) {
    let otherLives = hearts(3);
    //id will depend on the player's socket's id(the player's number will depend on who connected first e.g. player 1 is first connector)
    // create div with name and player image
    otherLives.children[0] = `(Player-${player.count})  ${player.username}:`;
    otherLives.setAttr('id', `player-${player.count}-lives`);
    otherLives.removeAttr('class', 'lives-container', 'other-lives');
    otherLivesContainer.setChild(otherLives);
  }
  return otherLivesContainer;
};
// -- //
