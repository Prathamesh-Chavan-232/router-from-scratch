import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./router/Router";
import generateRoutes from "./router/routeGenerator";

async function bootstrap() {
  const routes = generateRoutes();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Router routes={routes} />
      {/* <RouterProvider router={router} /> */}
    </React.StrictMode>,
  );
}

bootstrap();
