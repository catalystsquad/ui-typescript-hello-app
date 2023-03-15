// the string "route" that pairs to the render function
let routes: Map<string,Function> = new Map<string,Function>;
let defaultRoute: Function;
let routeHandler: (string);

// Define the routes. Each route is described with a route path & a render function
let RegisterRoute = (path: string, renderFunc: Function, isdefault = false): void => {
  routes[path] = renderFunc;
  if (isdefault) {
    defaultRoute = renderFunc
  }
};

// Unload a route, for whatever reason, I'm not your parent
let UnregisterRoute = (path: string): void => {
  if (path in routes) {
    delete routes[path]
  }
};

// Pushstate doesn't cause an event, so to be event driven, we must call a custom one
let sendChangedEvent = (path: string, state = {}): void => {
  document.dispatchEvent(new CustomEvent('urlChanged', {detail: {path: path, state: state}}))
};

// Run the route's Render function and return that string to the thing that cares
let RenderRoute = (path: string) => {
  if (path in routes) {
    return routes[path]();
  }
  if (defaultRoute) {
    return defaultRoute();
  }
  throw new Error("The route is not defined");
};

// The actual router, get the current URL and generate the corresponding template
let router = (_: Event) => {
  const url = window.location.pathname;
  sendChangedEvent(url);
};
let popstateRouter = (e: PopStateEvent) => {
  const url = window.location.pathname;
  sendChangedEvent(url, e.state);
};

// URL can be a full url including hashes
// but the router doesn't care about anything but pathname
let PushURL = (url: string, state = {}) => {
  window.history.pushState(state, "", url);
  sendChangedEvent(window.location.pathname, state)
};

// For first load or when routes are changed in browser url box.
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

window.addEventListener('popstate', popstateRouter);

export {RenderRoute, RegisterRoute, UnregisterRoute, PushURL }
