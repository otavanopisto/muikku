import { createBrowserRouter } from "react-router";
import {
  workspaceLoader,
  homeLoader,
  dashboardLoader,
  workspaceHomeLoader,
  workspaceSettingsLoader,
} from "./routeLoaders";
import { SharedLayout } from "~/src/layout/shared/SharedLayout";
import { authMiddleware } from "~/src/middleware/auth";
import { workspaceMiddleware } from "~/src/middleware/workspace";
import { permissionMiddlewares } from "~/src/middleware/permissions";
import {
  Home,
  Dashboard,
  Communicator,
  Coursepicker,
  Studies,
  Hops,
  Guider,
  Evaluation,
  Organization,
  Announcements,
  Announcer,
  Profile,
  WorkspaceHome,
  WorkspaceSettings,
  AppSettings,
  WorkspaceUsers,
  WorkspaceMaterials,
  WorkspaceJournal,
  WorkspaceHelp,
} from "~/src/pages/";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Home />,
    loader: homeLoader,
    middleware: [authMiddleware, permissionMiddlewares.homeView],
  },
  {
    element: <SharedLayout />,
    //loader: environmentLoader,
    middleware: [authMiddleware],
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
        middleware: [permissionMiddlewares.dashboardView],
      },
      {
        path: "communicator",
        element: <Communicator />,
        //loader: communicatorLoader,
        middleware: [permissionMiddlewares.communicatorView],
      },
      {
        path: "coursepicker",
        element: <Coursepicker />,
        //loader: coursepickerLoader,
        middleware: [permissionMiddlewares.coursepickerView],
      },
      {
        path: "studies",
        element: <Studies />,
        //loader: studiesLoader,
        middleware: [permissionMiddlewares.studiesView],
      },
      {
        path: "hops",
        element: <Hops />,
        //loader: hopsLoader,
        middleware: [permissionMiddlewares.hopsView],
      },
      {
        path: "guider",
        element: <Guider />,
        //loader: guiderLoader,
        middleware: [permissionMiddlewares.guiderView],
      },
      {
        path: "evaluation",
        element: <Evaluation />,
        //loader: evaluationLoader,
        middleware: [permissionMiddlewares.evaluationView],
      },
      {
        path: "organization",
        element: <Organization />,
        //loader: organizationLoader,
        middleware: [permissionMiddlewares.organizationView],
      },
      {
        path: "announcements",
        element: <Announcements />,
        //loader: announcementsLoader,
        middleware: [permissionMiddlewares.announcementsView],
      },
      {
        path: "announcer",
        element: <Announcer />,
        //loader: announcerLoader,
        middleware: [permissionMiddlewares.announcerView],
      },
      {
        path: "profile",
        element: <Profile />,
        //loader: profileLoader,
        middleware: [permissionMiddlewares.profileView],
      },

      {
        path: "appSettings",
        element: <AppSettings />,
        //loader: appSettingsLoader,
        middleware: [permissionMiddlewares.appSettingsView],
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
      {
        path: "workspaceHelp",
        element: <WorkspaceHelp />,
        //loader: workspaceHelpLoader,
        middleware: [permissionMiddlewares.workspaceHelpView],
      },
      {
        path: "workspaceJournal",
        element: <WorkspaceJournal />,
        //loader: workspaceJournalLoader,
        middleware: [permissionMiddlewares.workspaceJournalView],
      },
      {
        path: "workspaceMaterials",
        element: <WorkspaceMaterials />,
        //loader: workspaceMaterialsLoader,
        middleware: [permissionMiddlewares.workspaceMaterialsView],
      },
      {
        path: "workspaceUsers",
        element: <WorkspaceUsers />,
        //loader: workspaceUsersLoader,
        middleware: [permissionMiddlewares.workspaceUsersView],
      },
    ],
  },
]);
