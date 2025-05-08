import React from 'react';
import { useParams } from './params';
import { useQueryParams } from './query';
import { LayoutComponent } from './Layout';
import { navigate } from './navigate';
import { PageProps } from './Page';


export type RouteProps = {
  component: React.ComponentType<PageProps>;
  guard?: () => boolean | boolean;
  fallback?: string;
  layoutStack?: LayoutComponent[];
};


export function Route({ component: Component, guard, layoutStack, fallback = '/' }: RouteProps) {
  var params = useParams();
  var query = useQueryParams();

  var isAllowed = guard === undefined ? true : typeof guard === 'function' ? guard() : guard;

  if (!isAllowed) {
    navigate(fallback);
    return null;
  }

  var element = <Component params={params} query={query} />;

  if (layoutStack && layoutStack.length) {
    var startIndex = 0;
    var Layout;

    for (var i = 0; i < layoutStack.length; i++) {
      Layout = layoutStack[i];
      if (Layout.stackBehavior !== 'accumulate') startIndex = i;
    }

    // Compose layout from last replace point
    for (var i = layoutStack.length - 1; i >= startIndex; i--) {
      Layout = layoutStack[i];
      element = <Layout>{element}</Layout>;
    }
  }

  return element;
}