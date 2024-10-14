import MINI from '/framework/mini.js';
import { globalSettings } from '/components/modules/gameSettings.js';

export function placePowerUp(powerUpObj) {
  return MINI.tag.div(
    {
      class: `power-up ${powerUpObj['powerUp']}`,
      style: {
        top: powerUpObj['powerUpCoords'][0] * globalSettings['power-ups']['height'] + 'px',
        left: powerUpObj['powerUpCoords'][1] * globalSettings['power-ups']['width'] + 'px',
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
      { src: globalSettings['power-ups'][powerUpObj['powerUp']] }
    )
  );
}
