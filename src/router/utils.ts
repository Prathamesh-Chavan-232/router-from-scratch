import { RouteConfig } from "./types";

export function joinPaths(...parts: string[]): string {
  return parts
    .map((part, i) => {
      if (i === 0) return part.trim().replace(/\/*$/, "");
      return part.trim().replace(/(^\/+|\/+$)/g, "");
    })
    .filter((x) => x.length)
    .join("/");
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+/g, "/");
}

export function isDynamicRoute(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

export function formatDynamicSegment(segment: string): string {
  return segment.slice(1, -1).replace(/\[|\]/g, ":");
}

export function findRouteBySegments(
  routes: RouteConfig[],
  segments: string[],
): RouteConfig | undefined {
  if (segments.length === 0) {
    return routes.find((route) => route.path === "/");
  }

  let currentRoutes = routes;
  let currentPath = "";

  for (const segment of segments) {
    currentPath += "/" + segment;
    const route = currentRoutes.find((r) => r.path === currentPath);

    if (!route) return undefined;
    if (!route.children) return route;

    currentRoutes = route.children;
  }

  return currentRoutes.find((r) => r.path === currentPath);
}

export function insertRoute(
  routes: RouteConfig[],
  route: RouteConfig,
  segments: string[],
): void {
  if (segments.length === 0) {
    routes.push(route);
    return;
  }

  const [currentSegment, ...remainingSegments] = segments;
  const currentPath = `/${currentSegment}`;

  // Find or create the parent route
  let parentRoute = routes.find((r) => r.path === currentPath);

  if (!parentRoute) {
    parentRoute = {
      path: currentPath,
      component: null,
      children: [],
    };
    routes.push(parentRoute);
  }

  if (!parentRoute.children) {
    parentRoute.children = [];
  }

  if (remainingSegments.length === 0) {
    parentRoute.component = route.component;
    parentRoute.layout = route.layout;
  } else {
    insertRoute(parentRoute.children, route, remainingSegments);
  }
}
