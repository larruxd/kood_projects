export function browserHeight() {
  var screenHeight = window.screen.height;
  var windowTabHeight = window.outerHeight - window.innerHeight;
  var tabBarsHeight = window.innerHeight - document.documentElement.clientHeight;
  var searchBarHeight = 50;
  var scrollbarHeight = window.innerHeight < document.documentElement.clientHeight ? scrollbarWidth : 0;

  var maxHeight = screenHeight - windowTabHeight - tabBarsHeight - searchBarHeight - scrollbarHeight;
  return maxHeight;
}

export const globalSettings = {
  gridColumn1: window.screen.width * 0.17,
  gridColumn2: (window.screen.width - 10) * 0.6,
  gridColumn3: (window.screen.width - 20) * 0.2,
  gridFr: (browserHeight() - 60 - 60 - 15 - 20) / 2,
  gap: 10,
  gridRowGaps: 3,
  numOfRows: 13,
  numOfCols: 15,
  wallWidth: ((window.screen.width - 10 - 10) * 0.6) / 15,
  wallHeight: (browserHeight() - 60 - 60 - 15 - 15) / 13,
  wallTypes: {
    wall: '▉',
    softWall: 1,
    bomb: 2,
  },
  wallSrc: {
    hard: '/assets/img/b1.jpeg',
    soft: '/assets/img/rb.jpeg',
    empty: '/assets/img/bg.jpeg',
  },
  players: {
    width: (((window.screen.width - 10 - 10) * 0.6) / 15) * 0.8,
    height: ((browserHeight() - 60 - 60 - 15 - 15) / 13) * 0.8,
    player1: '/assets/img/white.gif',
    player2: '/assets/img/blue.gif',
    player3: '/assets/img/black.gif',
    player4: '/assets/img/red.gif',
  },
  speed: {
    normal: 0.05,
    fast: 0.1,
  },
  flames: {
    normal: 1,
    pickUp1: 2,
    pickUp2: 3,
    pickUp3: 4,
  },
  bombs: {
    normal: 1,
    pickUp1: 2,
    pickUp2: 3,
    pickUp3: 4,
  },
  'power-ups': {
    width: ((window.screen.width - 10 - 10) * 0.6) / 15,
    height: (browserHeight() - 60 - 60 - 15 - 15) / 13,
    speed: '/assets/img/speed.png',
    flames: '/assets/img/fire.png',
    bombs: '/assets/img/bomb.png',
    types: {
      speed: '⚡',
      flames: '🔥',
      bombs: '💣',
    },
  },
  bomb: {
    width: ((window.screen.width - 10 - 10) * 0.6) / 15,
    height: (browserHeight() - 60 - 60 - 15 - 15) / 13,
    src: '/assets/img/bombAnimated.gif',
  },
  explosion: {
    width: ((window.screen.width - 10 - 10) * 0.6) / 15,
    height: (browserHeight() - 60 - 60 - 15 - 15) / 13,
    src: '/assets/img/fire.gif',
  },
  defaultBombTimer: 3000, // Default bomb timer in millisecond
};

export function changeGameSettingValue(key, value) {
  globalSettings[key] = value;
}
