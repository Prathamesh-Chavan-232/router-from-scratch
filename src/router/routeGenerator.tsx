import { lazy } from "react";
import { LayoutModule, PageModule, RouteConfig } from "./types";
import {
  normalizePath,
  isDynamicRoute,
  formatDynamicSegment,
  insertRoute,
} from "./utils";

export default function generateRoutes(): RouteConfig[] {
  const pageModules = import.meta.glob("/src/pages/**/page.{tsx,jsx}", {
    eager: false,
  }) as Record<string, PageModule>;

  const layoutModules = import.meta.glob("/src/pages/**/layout.{tsx,jsx}", {
    eager: true,
  }) as Record<string, LayoutModule>;

  const routes: RouteConfig[] = [];

  for (const modulePath of Object.keys(pageModules)) {
    const normalizedPath = normalizePath(modulePath)
      .replace(/^\/src\/pages\//, "")
      .replace(/\/(page\.tsx|page\.jsx)$/, "");

    const segments = normalizedPath.split("/").filter(Boolean);
    let currentPath;

    if (
      modulePath === "/src/pages/page.tsx" ||
      modulePath === "/src/pages/page.jsx"
    ) {
      currentPath = "/";
    } else {
      currentPath =
        segments.length === 0
          ? "/"
          : "/" +
            segments
              .map((segment) =>
                isDynamicRoute(segment)
                  ? formatDynamicSegment(segment)
                  : segment,
              )
              .join("/");
    }

    const layoutPath = modulePath.replace(
      /(\/page\.tsx|\/page\.jsx)$/,
      (match) => match.replace("page", "layout"),
    );
    const layoutModule = layoutModules[layoutPath];

    // Create route configuration
    const route: RouteConfig = {
      path: currentPath,
      component: lazy(pageModules[modulePath]),
      layout: layoutModule?.default || undefined,
    };

    if (currentPath === "/") {
      routes.push(route);
    } else {
      insertRoute(routes, route, segments);
    }
  }

  return routes;
}
