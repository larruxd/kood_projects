import MINI from '/framework/mini.js';
import { congratulationsContainer, layoutContainer, waitingRoom } from '/components/modules/gameContainer.js';
import { runChatroom } from '/components/code.js';

function openGame() {
  return new Promise((resolve) => {
    const rootObj = MINI.tag.div({ class: 'app' }, {}, {});
    const rootEl = MINI.createNode(rootObj);
    framework.obj = rootObj;
    framework.rootEl = rootEl;
    document.body.appendChild(framework.rootEl);
    const container = layoutContainer();
    rootObj.setChild(waitingRoom);
    rootObj.setChild(container);
    rootObj.setChild(congratulationsContainer);
    resolve('success');
  });
}

openGame().then((response) => (response == 'success' ? runChatroom() : console.log('failed to open chatroom. Please Try Again later')));
