let framework = {
  rootEl: undefined,
  obj: undefined,
  players: {},
};

// Router that renders components based on their routes. Developer just needs to create an instance and pass in the endpoints.
// Router should be in global scope and routes should be hard coded.
class Router {
  constructor(routes) {
    this.routes = routes;
  }

  RenderFromRoutes(name) {
    this.routes[name]();
  }
}

let router = new Router();
