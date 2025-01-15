import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";

export default function generateRoutes(): RouteObject[] {
  const pages = import.meta.glob("/src/pages/**/*.(tsx|jsx)");
  const layouts = import.meta.glob("/src/pages/**/layout.(tsx|jsx)");
  const routes: RouteObject[] = [];

  // Helper function to create route path from file path
  function createRoutePath(path: string): string {
    return path
      .replace("/src/pages", "")
      .replace(/\.(tsx|jsx)$/, "")
      .replace(/\/page$/, "")
      .replace(/\/index$/, "")
      .replace(/\[\.{3}(\w+)\]/, "*$1") // [...param] -> *param
      .replace(/\[(\w+)\]/, ":$1") // [param] -> :param
      .toLowerCase();
  }

  // Helper function to find layout for a given path
  function findLayout(pagePath: string): string | undefined {
    const layoutPath = Object.keys(layouts).find((layoutPath) => {
      const layoutDir = layoutPath.replace("/layout.(tsx|jsx)$", "");
      return pagePath.startsWith(layoutDir);
    });
    return layoutPath;
  }

  for (const path of Object.keys(pages)) {
    // Skip if the file doesn't end with page.tsx or page.jsx
    if (!path.match(/page\.(tsx|jsx)$/)) continue;

    const normalizedPath = createRoutePath(path);
    const layoutPath = findLayout(path);

    const PageComponent = lazy(pages[path] as any);
    let element = (
      <Suspense fallback={<div>Loading...</div>}>
        <PageComponent />
      </Suspense>
    );

    // If layout exists, wrap the page component with it
    if (layoutPath) {
      const LayoutComponent = lazy(layouts[layoutPath] as any);
      element = (
        <Suspense fallback={<div>Loading...</div>}>
          <LayoutComponent>{element}</LayoutComponent>
        </Suspense>
      );
    }

    const route: RouteObject = {
      path: normalizedPath === "" ? "/" : normalizedPath,
      element,
    };

    routes.push(route);
  }

  return routes;
}
