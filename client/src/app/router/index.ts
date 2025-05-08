import { useEffect, useState } from 'react';
import { routes } from './routes';
import {
  PARAM_SEPARATOR,
  OPTIONAL_PARAM_SUFFIX,
  PARAM_DETECTOR,
} from './config';

export type Route = keyof typeof routes;

export function useRoute(): Route {
  var [route, setRoute] = useState(() => resolveRoute());

  useEffect(() => {
    var handleChange = () => setRoute(resolveRoute());
    window.addEventListener('popstate', handleChange);
    return () => window.removeEventListener('popstate', handleChange);
  }, []);

  return route;
}

export function resolveRoute(): string {
  let pathname = window.location.pathname;
  var knownRoutes = Object.keys(routes);
  var pathSegments = pathname.split('/').filter(Boolean); // e.g. ['test', '123&456', '3']

  // Sort more specific routes first (more required params wins)
  var sortedRoutes = knownRoutes.sort((a, b) => {
    var requiredA = a.split('/').filter(Boolean).flatMap(s => s.split(PARAM_SEPARATOR)).filter(p => !p.endsWith(OPTIONAL_PARAM_SUFFIX)).length;
    var requiredB = b.split('/').filter(Boolean).flatMap(s => s.split(PARAM_SEPARATOR)).filter(p => !p.endsWith(OPTIONAL_PARAM_SUFFIX)).length;
    return requiredB - requiredA;
  });

  for (var pattern of sortedRoutes) {
    var patternSegments = pattern.split('/').filter(Boolean);
    if (patternSegments.length !== pathSegments.length) continue;

    let isMatch = true;
    for (let i = 0; i < patternSegments.length; i++) {
      var routePart = patternSegments[i];
      var pathPart = pathSegments[i];

      if (!routePart.includes(PARAM_DETECTOR)) {
        if (routePart !== pathPart) {
          isMatch = false;
          break;
        }
        continue;
      }

      var routeParams = routePart.split(PARAM_SEPARATOR);
      var pathParams = pathPart.split(PARAM_SEPARATOR);

      var requiredCount = routeParams.filter(p => !p.endsWith(OPTIONAL_PARAM_SUFFIX)).length;
      if (pathParams.length < requiredCount || pathParams.length > routeParams.length) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) return pattern;
  }

  return '/not-found';
}