import { createBrowserRouter } from "react-router";
/* import { Layout } from "./layout/Layout";
import { WorkspaceLayout } from "./layout/workspaceLayout/WorkspaceLayout"; */
import { EnvironmentDashboard } from "./pages/EnviromentDashboard";
import { WorkspaceHome } from "./pages/WorkspaceHome";
import { WorkspaceSettings } from "./pages/WorkspaceSettings";
import { Home } from "./pages/Home";
import {
  //environmentLoader,
  workspaceLoader,
  homeLoader,
  dashboardLoader,
  workspaceHomeLoader,
  workspaceSettingsLoader,
} from "./routeLoaders";
import { SharedLayout } from "./layout/shared/SharedLayout";
import { authMiddleware } from "./middleware/auth";
import { workspaceMiddleware } from "./middleware/workspace";
import { permissionMiddlewares } from "./middleware/permissions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    //loader: environmentLoader,
    middleware: [authMiddleware],

    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
        middleware: [permissionMiddlewares.homeView],
      },
      {
        path: "dashboard",
        element: <EnvironmentDashboard />,
        loader: dashboardLoader,
        middleware: [permissionMiddlewares.dashboardView],
      },
      // Future routes can be added here with their own loaders
      // {
      //   path: "coursepicker",
      //   element: <Coursepicker />,
      //   loader: coursepickerLoader,
      // },
    ],
  },
  {
    path: "/workspace/:workspaceUrlName",
    element: <SharedLayout context="workspace" />,
    middleware: [authMiddleware, workspaceMiddleware],
    loader: workspaceLoader,
    children: [
      {
        index: true,
        element: <WorkspaceHome />,
        loader: workspaceHomeLoader,
        middleware: [permissionMiddlewares.workspaceHomeView],
      },
      {
        path: "workspaceManagement",
        element: <WorkspaceSettings />,
        loader: workspaceSettingsLoader,
        middleware: [permissionMiddlewares.workspaceManagementView],
      },
    ],
  },
]);
