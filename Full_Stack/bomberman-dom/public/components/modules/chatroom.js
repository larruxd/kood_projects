import MINI from '/framework/mini.js';

export const chatroom = MINI.tag.div(
  { class: 'main-app' },
  {},
  {},
  MINI.tag.div(
    { class: 'screen chat-screen' },
    {},
    {},
    MINI.tag.div(
      { class: 'header' },
      {},
      {},
      MINI.tag.div({ class: 'logo' }, {}, {}, 'Chatroom')
      //MINI.tag.button({ id: 'exit-chat' }, {}, {}, 'Exit')
    ),
    MINI.tag.div({ class: 'messages' }, {}, {}),
    MINI.tag.div(
      { class: 'typebox' },
      {},
      {},
      MINI.tag.input({ type: 'text', id: 'message-input' }, {}, {}),
      MINI.tag.button({ id: 'send-message' }, {}, {}, 'Send')
    )
  )
);
