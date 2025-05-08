import {
  OPTIONAL_PARAM_PREFIX,
  OPTIONAL_PARAM_SUFFIX,
  PARAM_SEPARATOR,
  PAGES_IMPORT_META,
  REGEX_PAGE_MATCH,
  REGEX_TRAILING_SLASH,
  REGEX_DYNAMIC_PARAM_BLOCK,
  SPECIAL_FOLDER_BEHAVIOR,
  REGEX_LAYOUT_MATCH,
  LAYOUTS_IMPORT_META,
  PARAM_DETECTOR,
} from './config';

import { RouteProps } from './Route';
import { LayoutComponent } from './Layout';

var layouts: Record<string, LayoutComponent> = {};
var routes: Record<string, RouteProps> = {};

// Register layouts
for (var path in LAYOUTS_IMPORT_META) {
  var match = path.match(REGEX_LAYOUT_MATCH);
  if (!match) continue;

  var layoutPath = match[1].replace(REGEX_TRAILING_SLASH, '');
  var mod = LAYOUTS_IMPORT_META[path] as any;
  if (typeof mod?.default !== 'function') continue;

  // Apply alias to layout key
  var layoutSegments = layoutPath
  .split('/')
  .map(segment =>
    SPECIAL_FOLDER_BEHAVIOR[segment]?.alias ?? segment
  );

  var layoutKey = layoutSegments.join('/');
  layouts[layoutKey] = mod.default;
}

// Register pages
for (var path in PAGES_IMPORT_META) {
  var match = path.match(REGEX_PAGE_MATCH);
  if (!match) continue;

  var mod = PAGES_IMPORT_META[path] as any;
  if (typeof mod?.default !== 'function') continue;

  // Step 1: Get raw folder segments and apply alias
  var rawSegments = match[1]
    .replace(REGEX_TRAILING_SLASH, '')
    .split('/')
    .map(segment =>
      SPECIAL_FOLDER_BEHAVIOR[segment]?.alias ?? segment
    );

  // Step 2: Build route path (transform params like [a&__b] → :a&:b?)
  var routePath = [...rawSegments].map(segment =>
    segment.replace(REGEX_DYNAMIC_PARAM_BLOCK, (_, params) =>
      params
        .split(PARAM_SEPARATOR)
        .map((p: string) =>
          p.startsWith(OPTIONAL_PARAM_PREFIX)
            ? PARAM_DETECTOR + p.slice(OPTIONAL_PARAM_PREFIX.length) + OPTIONAL_PARAM_SUFFIX
            : PARAM_DETECTOR + p
        )
        .join(PARAM_SEPARATOR)
    )
  );

  // Step 3: Guard/fallback logic
  let guard: (() => boolean) | undefined;
  let fallback: string | undefined;

  for (let i = 0; i < routePath.length; i++) {
    var original = match[1].split('/')[i];
    var behavior = SPECIAL_FOLDER_BEHAVIOR[original];
    if (!behavior) continue;
    if (behavior.guard) guard = behavior.guard;
    if (behavior.fallback) fallback = behavior.fallback;
  }

  // Step 4: Layout stack based on raw alias segments
  var layoutStack: LayoutComponent[] = [];
  for (let i = 0; i < rawSegments.length; i++) {
    var layoutKey = rawSegments.slice(0, i + 1).join('/');
    if (layouts[layoutKey]) layoutStack.push(layouts[layoutKey]);
  }

  // Step 5: Final path
  var finalPath = '/' + routePath.filter(Boolean).join('/');

  // Register route
  if (!routes[finalPath]) routes[finalPath] = { component: mod.default, guard, fallback, layoutStack };
  else console.warn(`[router] Duplicate route pattern: ${finalPath}. Ignoring "${path}"`);

}

export { routes };
