import { globalSettings } from '/components/modules/gameSettings.js';
import MINI from '/framework/mini.js';
const template = [
  ['▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉'],
  ['▉', 'x', 'l', , , , , , , , , , 'l', 'y', '▉'],
  ['▉', 'l', '▉', , '▉', , '▉', , '▉', , '▉', , '▉', 'l', '▉'],
  ['▉', 'l', , , , , , , , , , , , 'l', '▉'],
  ['▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉'],
  ['▉', , , , , , , , , , , , , , '▉'],
  ['▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉'],
  ['▉', , , , , , , , , , , , , , '▉'],
  ['▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉'],
  ['▉', 'l', , , , , , , , , , , , 'l', '▉'],
  ['▉', 'l', '▉', , '▉', , '▉', , '▉', , '▉', , '▉', 'l', '▉'],
  ['▉', 'z', 'l', , , , , , , , , , 'l', 'w', '▉'],
  ['▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉', '▉'],
];

// -- creates an 2d array of map with randomly generated soft walls and empty spaces --//
let choiceOfPowerUp = ['speed', 'flames', 'bombs'];
export function generateLevel() {
  let cells = [];

  for (let row = 0; row < globalSettings.numOfRows; row++) {
    cells[row] = [];

    for (let col = 0; col < globalSettings.numOfCols; col++) {
      // 85% chance cells will contain a soft wall
      if (!template[row][col] && Math.random() < 0.85) {
        cells[row][col] = globalSettings.wallTypes.softWall;
        if (Math.random() < 0.3) {
          cells[row][col] += globalSettings['power-ups']['types'][choiceOfPowerUp[Math.floor(Math.random() * choiceOfPowerUp.length)]];
        }
      }

      if (template[row][col] === globalSettings.wallTypes.wall) {
        cells[row][col] = globalSettings.wallTypes.wall;
      } else if (template[row][col] === 'w' || template[row][col] === 'x' || template[row][col] === 'y' || template[row][col] === 'z') {
        cells[row][col] = template[row][col];
      }
    }
  }
  return cells;
}

// -- add corresponding image VDOMs to empty spaces, soft/hard walls accordingly t --//
export function createMap(map) {
  const gameWrapper = MINI.tag.div({ class: 'game-wrapper' }, {}, {});
  for (let row = 0; row < globalSettings.numOfRows; row++) {
    for (let col = 0; col < globalSettings.numOfCols; col++) {
      switch (map[row][col]) {
        case globalSettings.wallTypes.wall:
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'hard-wall',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.hard }
            )
          );
          break;
        case globalSettings.wallTypes.softWall:
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'dirt-patch',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'soft-wall',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.soft }
            )
          );
          break;
        case 'x':
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'loading-1',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          break;
        case 'w':
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'loading-2',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          break;
        case 'y':
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'loading-3',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          break;
        case 'z':
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'loading-4',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          break;
        case `1${globalSettings['power-ups']['types']['speed']}`:
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'dirt-patch',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'soft-wall',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.soft }
            )
          );
          gameWrapper.setChild(
            MINI.tag.div(
              {
                class: `power-up speed`,
                style: {
                  top: `${row * globalSettings['power-ups']['height']}px`,
                  left: `${col * globalSettings['power-ups']['width']}px`,
                  width: `${globalSettings['power-ups']['width']}px`,
                  height: `${globalSettings['power-ups']['height']}px`,
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
                { src: globalSettings['power-ups']['speed'] }
              )
            )
          );
          break;
        case `1${globalSettings['power-ups']['types']['flames']}`:
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'dirt-patch',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'soft-wall',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.soft }
            )
          );
          gameWrapper.setChild(
            MINI.tag.div(
              {
                class: `power-up flames`,
                style: {
                  top: `${row * globalSettings['power-ups']['height']}px`,
                  left: `${col * globalSettings['power-ups']['width']}px`,
                  width: `${globalSettings['power-ups']['width']}px`,
                  height: `${globalSettings['power-ups']['height']}px`,
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
                { src: globalSettings['power-ups']['flames'] }
              )
            )
          );
          break;
        case `1${globalSettings['power-ups']['types']['bombs']}`:
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'dirt-patch',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'soft-wall',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.soft }
            )
          );
          gameWrapper.setChild(
            MINI.tag.div(
              {
                class: `power-up bombs`,
                style: {
                  top: `${row * globalSettings['power-ups']['height']}px`,
                  left: `${col * globalSettings['power-ups']['width']}px`,
                  width: `${globalSettings['power-ups']['width']}px`,
                  height: `${globalSettings['power-ups']['height']}px`,
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
                { src: globalSettings['power-ups']['bombs'] }
              )
            )
          );
          break;
        default:
          gameWrapper.setChild(
            MINI.tag.img(
              {
                class: 'dirt-patch',
                style: {
                  top: `${row * globalSettings.wallHeight}px`,
                  left: `${col * globalSettings.wallWidth}px`,
                  width: `${globalSettings.wallWidth}px`,
                  height: `${globalSettings.wallHeight}px`,
                },
              },
              {},
              { src: globalSettings.wallSrc.empty }
            )
          );
          break;
      }
    }
  }
  return gameWrapper;
}
