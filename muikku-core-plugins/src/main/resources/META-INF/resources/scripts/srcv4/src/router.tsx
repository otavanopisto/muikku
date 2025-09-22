import { createBrowserRouter } from "react-router";
import { Layout } from "./layout/Layout";
import { WorkspaceLayout } from "./layout/workspaceLayout/WorkspaceLayout";
import { EnvironmentDashboard } from "./pages/EnviromentDashboard";
import { WorkspaceHome } from "./pages/WorkspaceHome";
import { WorkspaceSettings } from "./pages/WorkspaceSettings";
import { Home } from "./pages/Home";
import {
  environmentLoader,
  workspaceLoader,
  homeLoader,
  dashboardLoader,
  workspaceHomeLoader,
  workspaceSettingsLoader,
} from "./routeLoaders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: environmentLoader,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: "dashboard",
        element: <EnvironmentDashboard />,
        loader: dashboardLoader,
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
    element: <WorkspaceLayout />,
    loader: workspaceLoader,
    children: [
      {
        index: true,
        element: <WorkspaceHome />,
        loader: workspaceHomeLoader,
      },
      {
        path: "workspaceManagement",
        element: <WorkspaceSettings />,
        loader: workspaceSettingsLoader,
      },
    ],
  },
]);
