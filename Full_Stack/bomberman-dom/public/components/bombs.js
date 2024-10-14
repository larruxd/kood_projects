import MINI from '/framework/mini.js';
import { globalSettings } from '/components/modules/gameSettings.js';

function placeBomb(moving) {
  const player = framework['players'][moving['myPlayerNum']];

  // Check if the player can place a bomb (based on active bombs and max allowed)
  if (player['numOfActiveBombs'] < player['maxAllowedBombs']) {
    // Increment the number of active bombs
    player['numOfActiveBombs'] += 1;

    // placing the bomb
    const bombElement = MINI.tag.div(
      {
        class: `player-${moving['myPlayerNum']}-bomb player-${moving['myPlayerNum']}-just-dropped-bomb`,
        style: {
          top: Math.round(moving.row) * globalSettings['bomb']['height'] + 'px',
          left: Math.round(moving.col) * globalSettings['bomb']['width'] + 'px',
          width: `${globalSettings['bomb']['width']}px`,
          height: `${globalSettings['bomb']['height']}px`,
          position: 'absolute',
        },
      },
      {},
      {},
      MINI.tag.img(
        {
          style: {
            width: '100%',
            height: '100%',
          },
        },
        {},
        { src: globalSettings['bomb']['src'] }
      )
    );

    // Set a timeout for the bomb explosion
    setTimeout(() => {
      // Decrement the number of active bombs
      player['numOfActiveBombs'] -= 1;

      // Code to handle bomb explosion (to be implemented as needed)
      // ...
    }, player['bombTimer']);

    // Return the bomb element to be added to the DOM
    return bombElement;
  }
}

function placeExplosion(moving) {
  return MINI.tag.div(
    {
      class: `player-${moving['myPlayerNum']}-explosion explosion`,
      style: {
        top: Math.round(moving.row) * globalSettings['bomb']['height'] + 'px',
        left: Math.round(moving.col) * globalSettings['bomb']['width'] + 'px',
        width: `${globalSettings['explosion']['width']}px`,
        height: `${globalSettings['explosion']['height']}px`,
        position: 'absolute',
      },
    },
    {},
    {},
    MINI.tag.img(
      {
        style: {
          width: '100%',
          height: '100%',
        },
      },
      {},
      { src: globalSettings['explosion']['src'] }
    )
  );
}
function removeFromCellsAndDom(row, col, querySelectorStatement) {
  if (framework.cells[row][col] == globalSettings.wallTypes.softWall) {
    framework.cells[row][col] = null;
  } else if (framework.cells[row][col] == `1${globalSettings['power-ups']['types']['speed']}`) {
    framework.cells[row][col] = globalSettings['power-ups']['types']['speeds'];
  } else if (framework.cells[row][col] == `1${globalSettings['power-ups']['types']['flames']}`) {
    framework.cells[row][col] = globalSettings['power-ups']['types']['flames'];
  } else if (framework.cells[row][col] == `1${globalSettings['power-ups']['types']['bombs']}`) {
    framework.cells[row][col] = globalSettings['power-ups']['types']['bombs'];
  }
  const removeDomEle = Array.from(
    //.soft-wall
    document.querySelectorAll(`.${querySelectorStatement}`)
  ).filter((ele) => {
    let eleTopDp = Math.pow(10, 0);
    if (ele.style.top.includes('.')) {
      eleTopDp = Math.pow(10, ele.style.top.split('.')[1].length - 2);
    }
    let eleLeftDp = Math.pow(10, 0);
    if (ele.style.left.includes('.')) {
      eleLeftDp = Math.pow(10, ele.style.left.split('.')[1].length - 2);
    }
    let top = Math.round(row * globalSettings['wallHeight'] * eleTopDp) / eleTopDp;
    let left = Math.round(col * globalSettings['wallWidth'] * eleLeftDp) / eleLeftDp;
    return (
      Math.round(parseFloat(ele.style.top) * eleTopDp) / eleTopDp === top &&
      Math.round(parseFloat(ele.style.left) * eleLeftDp) / eleLeftDp === left
    );
  });
  while (removeDomEle.length > 0) {
    removeDomEle.shift().remove();
  }
}

// Function to handle explosion propagation in a specific direction
function propagateExplosion(rowChange, colChange, moving) {
  let tmpMovingObj = JSON.parse(JSON.stringify(moving));
  let gameWrapper = document.querySelector('.game-wrapper');
  for (let r = 0; r < moving.flames; r++) {
    tmpMovingObj.row = Math.round(tmpMovingObj.row);
    tmpMovingObj.col = Math.round(tmpMovingObj.col);
    tmpMovingObj.row += rowChange;
    tmpMovingObj.col += colChange;

    // Check if the cell is a wall
    // Stop the explosion if it is
    if (framework.cells[tmpMovingObj.row][tmpMovingObj.col] === globalSettings.wallTypes.wall) break;

    // Check if the cell is a soft wall
    if (
      framework.cells[tmpMovingObj.row][tmpMovingObj.col] === globalSettings.wallTypes.softWall ||
      framework.cells[tmpMovingObj.row][tmpMovingObj.col] === `1${globalSettings['power-ups']['types']['speed']}` ||
      framework.cells[tmpMovingObj.row][tmpMovingObj.col] === `1${globalSettings['power-ups']['types']['flames']}` ||
      framework.cells[tmpMovingObj.row][tmpMovingObj.col] === `1${globalSettings['power-ups']['types']['bombs']}`
    ) {
      //destroy the soft wall
      removeFromCellsAndDom(tmpMovingObj.row, tmpMovingObj.col, 'soft-wall');
      break;
    }
    // If the cell is not a wall place the explosion at the current position
    gameWrapper.appendChild(MINI.createNode(placeExplosion(tmpMovingObj)));
  }
}

export async function placeBombAndExplode(moving) {
  return new Promise((res, reject) => {
    let newBomb = placeBomb(moving);
    if (newBomb == undefined) {
      reject('placeBomb is undefined');
    } else {
      let bombElement = MINI.createNode(newBomb);
      setTimeout(() => {
        bombElement.classList.replace(`player-${moving['myPlayerNum']}-just-dropped-bomb`, 'bomb');
      }, 1000);
      let gameWrapper = document.querySelector('.game-wrapper');
      gameWrapper.appendChild(bombElement);
      setTimeout(() => {
        bombElement.className = `player-${moving['myPlayerNum']}-explosion explosion`;
        bombElement.children[0].src = globalSettings.explosion.src;
        // Propagate explosion in all four directions
        propagateExplosion(0, 1, moving); // Right
        propagateExplosion(0, -1, moving); // Left
        propagateExplosion(1, 0, moving); // Down
        propagateExplosion(-1, 0, moving); // Up
      }, 2000);
      setTimeout(() => {
        res(moving);
      }, 2500);
    }
  });
}
