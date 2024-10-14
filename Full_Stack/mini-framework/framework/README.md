# Mini Framework Documentation

The Mini Framework is a lightweigh framework designed to simplify web application development. It provides a simple state management system, DOM manipulation utilities, and a client-side router.

## Table of Contents

- [Getting Started](#getting-started)
- [State Management](#state-management)
- [DOM Manipulation](#dom-manipulation)
- [Routing](#routing)

## Getting Started

To start using the Mini Framework in your web application, import the `index.js` file into your app:

```javascript
import fw from 'path/to/index.js';
```

## State Management

The Mini Framework provides a simple state management system. You can create and subscribe to states, update their values, and react to changes in your application.

### Creating a State

```javascript
const myState = new fw.State(initialValue);
```

### Updating State Value

```javascript
myState.setState(newValue);
```

### Getting state value

```javascript
myState.getState();
```

### Subscribing to State Changes

```javascript
myState.subscribe(() => {
  console.log('State changed:', myState.getState());
});
```

## DOM Manipulation

The Mini Framework offers utilities to simplify DOM manipulation tasks. You can create DOM elements, bind events, and update the DOM dynamically.

### Creating DOM Elements

Syntax:

```javascript
fw.div(props, children);
```

Example:

```javascript
const divElement = fw.div({ class: 'my-class' }, 'Hello, world!');
const h1Element = fw.h1({ id: 'title' }, 'My Title');
```

### Adding event listeners

You can add eventlistener by including it in the props of the elment like so:

```javascript
const button = fw.button({ onClick: () => console.log('Button clicked'), class: 'button' });
```

### Nesting elements

When creating an element add another element as a second argument

```javascript
const nestedDivs = fw.div(
  { class: 'div1' },
  fw.div(
    { class: 'div2' }
    // any other nested element ...
  )
);
```

### Binding elements to dom

Syntax:

```javascript
fw.bindToDom(componentFunc, state, keyFunction);

/**
 * Binds a component function to the DOM, using the provided state and key function.
 *
 * @param {Function} componentFunc - The component function that returns the HTML structure to bind.
 * @param {Object} state - The state object to use.
 * @param {Function} keyFunction - The key function for uniquely identifying DOM elements.
 */
```

You can see it in action in the [example](#example)

## Routing

The Mini Framework includes a client-side router to manage navigation and rendering different views based on URL changes.

### Creating a Router

```javascript
const container = document.getElementById('app');
const router = fw.createRouter(container);
```

### Registering Routes

```javascript
router.registerRoute('/', HomeComponent);
router.registerRoute('/about', AboutComponent);
```

### Navigating to Routes

```javascript
router.navigateTo('/');
```

### Creating links

```javascript
const myLink = fw.a({ href: '/home', 'data-use-router': true }, 'To Home');
```

### Initial render

To make your app render add this to the end of your file

```javascript
fw.navigate();
```

## Example

### Simple counter app

```javascript
import fw from '../framework/index.js';

const container = document.getElementById('app');
const router = fw.router(container);

const counterState = new fw.State({ count: 0 });

// counting functions
const increment = () => {
  counterState.setState({ count: counterState.getState().count + 1 });
};

const decrement = () => {
  counterState.setState({ count: counterState.getState().count - 1 });
};

// counter component
const Counter = () => {
  return fw.div(
    null,
    fw.h1(null, `Count: ${counterState.getState().count}`),
    fw.button({ onclick: increment }, '+'),
    fw.button({ onclick: decrement }, '-')
  );
};

// components
const Home = () => {
  return [
    fw.div(null, 'HOME PAGE'),
    fw.bindToDOM(Counter, counterState, () => 'counter'),
    fw.a({ href: '/about', 'data-use-router': true }, 'To About page'),
  ];
};

const About = () => {
  return [fw.div(null, 'ABOUT PAGE')];
};

// Register routes
router.registerRoute('/', Home);
router.registerRoute('/about', About);
// Initiate first render
router.navigate();
```
