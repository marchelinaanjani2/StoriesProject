export const parseRoute = (path) => {
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length === 0) return { route: '/', params: {} };
  
  const route = `/${segments.join('/')}`;
  return { route, params: {} };
};

export const matchRoute = (path, routes) => {
  const { route } = parseRoute(path);
  

  if (routes[route]) {
    return { page: routes[route], params: {} };
  }
  
  // Dynamic route match (e.g., /detail/:id)
  for (const [routePattern, page] of Object.entries(routes)) {
    const patternSegments = routePattern.split('/').filter(Boolean);
    const routeSegments = route.split('/').filter(Boolean);  
    
    if (patternSegments.length !== routeSegments.length) continue;
    
    const params = {};
    let isMatch = true;
    
    for (let i = 0; i < patternSegments.length; i++) {
      if (patternSegments[i].startsWith(':')) {
        params[patternSegments[i].substring(1)] = routeSegments[i];
      } else if (patternSegments[i] !== routeSegments[i]) {
        isMatch = false;
        break;
      }
    }
    
    if (isMatch) return { page, params };
  }
  

  if (routes['/not-found']) {
    return { page: routes['/not-found'], params: {} };
  }
  

  return { page: undefined, params: {} };
};
