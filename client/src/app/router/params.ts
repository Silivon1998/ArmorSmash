import { routes } from "./routes";
import {
  OPTIONAL_PARAM_SUFFIX,
  PARAM_DETECTOR,
  PARAM_SEPARATOR,
} from "./config";

export function useParams(): Record<string, string | undefined> {
  var pathname = window.location.pathname;
  var knownRoutes = Object.keys(routes);
  var pathSegments = pathname.split('/').filter(Boolean);

  for (var pattern of knownRoutes) {
    if (!pattern.includes(PARAM_DETECTOR)) continue;

    var patternSegments = pattern.split('/').filter(Boolean);
    if (patternSegments.length !== pathSegments.length) continue;

    let result: Record<string, string | undefined> = {};
    let match = true;

    for (let i = 0; i < patternSegments.length; i++) {
      var routePart = patternSegments[i];
      var pathPart = pathSegments[i];

      if (!routePart.includes(PARAM_DETECTOR)) {
        if (routePart !== pathPart) {
          match = false;
          break;
        }
        continue;
      }

      var routeParams = routePart.split(PARAM_SEPARATOR);
      var pathParams = pathPart.split(PARAM_SEPARATOR);

      var requiredCount = routeParams.filter(p => !p.endsWith(OPTIONAL_PARAM_SUFFIX)).length;
      if (pathParams.length < requiredCount || pathParams.length > routeParams.length) {
        match = false;
        break;
      }

      for (let j = 0; j < routeParams.length; j++) {
        var key = routeParams[j].replaceAll(PARAM_DETECTOR, '').replace(OPTIONAL_PARAM_SUFFIX, '');
        result[key] = pathParams[j] !== undefined ? decodeURIComponent(pathParams[j]) : undefined;
      }
    }

    if (match) return result;
  }

  return {};
}