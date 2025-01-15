import React, { ComponentType, LazyExoticComponent, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { RouteConfig } from "./types";

interface RouterProps {
  routes: RouteConfig[];
}

function renderRoutes(routes: RouteConfig[]): React.ReactNode {
  return routes.map((route) => {
    if (route.component === null) {
      console.error("Missing component for route:", route.path);
      return null;
    }

    const PageComponent = route.component as LazyExoticComponent<
      ComponentType<unknown>
    >;

    const RouteElement = () => {
      if (route.layout) {
        const Layout = route.layout;
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Layout>
              <PageComponent />
            </Layout>
          </Suspense>
        );
      }

      return (
        <Suspense fallback={<div>Loading...</div>}>
          <PageComponent />
        </Suspense>
      );
    };

    return (
      <Route key={route.path} path={route.path} element={<RouteElement />}>
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
}

export function Router({ routes }: RouterProps) {
  if (!routes.length) {
    return <div>No routes configured</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
