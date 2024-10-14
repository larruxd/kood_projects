import { render } from './index.js';

function createRouter(container) {
  if (!(container instanceof HTMLElement)) {
    throw new Error(`${container} must be a valid HTML element`);
  }

  const routes = {};
  let notFound = null;
  //   let currentState = {};

  function registerRoute(path, component) {
    routes[path] = component;
  }

  function notFoundHandler(component) {
    notFound = component;
  }

  function navigate(e) {
    const path = window.location.pathname;
    const component = routes[path] || notFound;
    window.history.pushState({}, '', path);
    if (component) {
      render(container, component);
    } else {
      console.error(`Component for path ${path} not found`);
    }
  }

  window.onpopstate = navigate;
  window.addEventListener('navigate', (e) => {
    console.log(e.target);
    navigate(e);
  });

  return {
    registerRoute,
    navigate,
    notFoundHandler,
  };
}

export default createRouter;
