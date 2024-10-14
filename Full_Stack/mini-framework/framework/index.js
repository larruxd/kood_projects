import { createElement } from './element.js';
import { elements } from './element.js';
import createRouter from './router.js';

export function render(target, component) {
  if (!(target instanceof HTMLElement)) {
    throw new Error('Container must be a valid HTML element');
  }

  // Clear the container
  target.innerHTML = '';

  // Append the component
  const comp = component();
  if (Array.isArray(comp)) {
    comp.forEach((child) => {
      if (child instanceof HTMLElement) {
        target.appendChild(child);
      }
    });
  } else if (comp instanceof HTMLElement) {
    target.appendChild(comp);
  }
}

// function for binding state to dom
function bindToDOM(getter, state, keyFn) {
  let element = getter() || document.createComment('placeholder');
  const keyMap = new Map();

  // Update the DOM element with the initial state
  updateDOM();

  // Subscribe to state changes
  state.subscribe(updateDOM);

  function updateDOM() {
    const newElement = getter();
    if (!newElement || !newElement.children || newElement.children.length === 0) {
      return; // Do nothing if the new element is null or has no children
    }

    const newKeyMap = new Map();
    const newChildren = Array.from(newElement.children);

    newChildren.forEach((child) => {
      const key = keyFn(child);
      const existingChild = keyMap.get(key);
      if (existingChild) {
        // Update existing child with new properties
        existingChild.checked = child.checked;
        existingChild.className = child.className;
      } else {
        // Add new child to new key map
        newKeyMap.set(key, child);
      }
    });

    // Replace element with newElement in the DOM
    element.replaceWith(newElement);
    element = newElement;

    // Clear keyMap and populate it with entries from newKeyMap
    keyMap.clear();
    newKeyMap.forEach((value, key) => keyMap.set(key, value));
  }

  return element;
}

// state managment
class State {
  constructor(initialState) {
    this.state = initialState;
    this.prevState = null;
    this.listeners = [];
  }

  // Set the state and notify listeners
  setState(newState) {
    this.prevState = this.state;
    this.state = newState;
    this.notifyListeners();
  }

  // Get the current state
  getState() {
    return this.state;
  }

  // Subscribe a listener to state changes
  subscribe(listener) {
    this.listeners.push(listener);
  }

  // Unsubscribe a listener from state changes
  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Notify all listeners of state changes
  notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.state, this.prevState);
    });
  }
}

const fw = {
  createRouter,
  createElement,
  State,
  bindToDOM,
  ...elements,
};

export default fw;
