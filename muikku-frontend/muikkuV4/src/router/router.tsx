import { createBrowserRouter } from "react-router";
import { routeLoaders } from "src/router/routeLoaders";
import {
  authMiddleware,
  permissionMiddlewares,
  workspaceMiddleware,
} from "src/router/middleware";
import {
  Home,
  Dashboard,
  Communicator,
  CommunicatorTags,
  CommunicatorThread,
  CommunicatorThreadList,
  Coursepicker,
  Studies,
  Hops,
  Guider,
  Evaluation,
  Announcements,
  AnnouncementsEmpty,
  AnnouncementReadingPane,
  Announcer,
  AnnouncerList,
  AnnouncerCategories,
  AnnouncerDetails,
  Profile,
  WorkspaceHome,
  WorkspaceSettings,
  AppSettings,
  WorkspaceUsers,
  WorkspaceMaterials,
  WorkspaceJournal,
  WorkspaceHelp,
  NotFound,
  GuiderStudent,
  ErrorBoundary,
} from "src/pages/";
import { ErrorBoundaryRoot } from "src/components";
import { RootLayout } from "src/layouts";
import {
  announcerSubItems,
  communicatorSubItems,
  coursepickerSubItems,
  evaluationSubItems,
  guiderSubItems,
} from "../navigation/navigation";
import { Calendar } from "../pages/Calendar";

// Router
export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundaryRoot />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
        loader: routeLoaders.homeLoader,
        middleware: [authMiddleware, permissionMiddlewares.homeView],
      },
      {
        element: <RootLayout />,
        errorElement: <RootLayout isErrorBoundary />,
        loader: () => null,
        middleware: [authMiddleware],
        children: [
          {
            errorElement: <ErrorBoundary />,
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
                loader: routeLoaders.dashboardLoader,
                middleware: [permissionMiddlewares.dashboardView],
              },
              {
                path: "calendar",
                element: <Calendar />,
                loader: routeLoaders.calendarLoader,
                middleware: [permissionMiddlewares.calendarView],
              },
              {
                path: "communicator",
                element: <Communicator />,
                loader: routeLoaders.communicatorLoader,
                middleware: [permissionMiddlewares.communicatorView],
                handle: {
                  secondaryNav: {
                    title: "Viestit",
                    items: communicatorSubItems,
                  },
                },
                children: [
                  {
                    index: true,
                    element: <CommunicatorThreadList />,
                    loader: false,
                  },
                  {
                    path: "taglist",
                    element: <CommunicatorTags />,
                    loader: routeLoaders.communicatorTagsLoader,
                  },
                  {
                    path: ":threadId",
                    element: <CommunicatorThread />,
                    loader: routeLoaders.communicatorThreadLoader,
                  },
                ],
              },
              {
                path: "coursepicker",
                element: <Coursepicker />,
                //loader: coursepickerLoader,
                middleware: [permissionMiddlewares.coursepickerView],
                handle: {
                  secondaryNav: {
                    title: "Kurssipoimuri",
                    items: coursepickerSubItems,
                  },
                },
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
                // loader: hopsLoader,
                middleware: [permissionMiddlewares.hopsView],
              },
              {
                path: "guider",
                element: <Guider />, // becomes layout (with <Outlet />)
                loader: routeLoaders.guiderLoader,
                middleware: [permissionMiddlewares.guiderView],
                handle: {
                  secondaryNav: {
                    title: "Ohjaamo",
                    items: guiderSubItems,
                  },
                },
                children: [
                  { index: true, element: <>Yhteenveto</> }, // /guider
                  { path: "students", element: <>Opiskelijalistaus</> }, // /guider/students
                  { path: "tasks", element: <>Tehtävät</> }, // /guider/tasks
                  // other future guider root subroutes...
                ],
              },
              {
                path: "guider/:studentId",
                element: <GuiderStudent />,
                loader: routeLoaders.guiderStudentLoader,
                middleware: [permissionMiddlewares.guiderView],
                handle: {
                  secondaryNav: {
                    title: "Ohjaamo",
                    items: guiderSubItems,
                  },
                },
                children: [
                  {
                    index: true,
                    element: <>Opiskelijan tiedot</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "activity",
                    element: <>Aktiivisuus</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "hops",
                    element: <>Opiskelusuunnitelma (HOPS)</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "pedagogy-support",
                    element: <>Oppimisen tuki</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "guidance-relationship",
                    element: <>Ohjaussuhde</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "study-history",
                    element: <>Opintohistoria</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "files",
                    element: <>Tiedostot</>,
                    //loader: guiderHomeLoader,
                  },
                ],
              },
              {
                path: "evaluation",
                element: <Evaluation />,
                //loader: evaluationLoader,
                middleware: [permissionMiddlewares.evaluationView],
                handle: {
                  secondaryNav: {
                    title: "Arviointi",
                    items: evaluationSubItems,
                  },
                },
              },
              {
                path: "announcements",
                element: <Announcements />,
                //loader: announcementsLoader,
                middleware: [permissionMiddlewares.announcementsView],
                children: [
                  { index: true, element: <AnnouncementsEmpty /> }, // "Valitse tiedote" / auto-open first
                  {
                    path: ":announcementId",
                    element: <AnnouncementReadingPane />,
                  },
                ],
              },
              {
                path: "announcer",
                element: <Announcer />,
                middleware: [permissionMiddlewares.announcerView],
                handle: {
                  secondaryNav: {
                    title: "Tiedotteet",
                    items: announcerSubItems,
                  },
                },
                children: [
                  { index: true, element: <AnnouncerList /> },
                  { path: "categories", element: <AnnouncerCategories /> }, // static before :id
                  { path: ":announcementId", element: <AnnouncerDetails /> },
                ],
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

              {
                path: "*",
                element: <NotFound />,
              },

              // Future routes can be added here with their own loaders
              // {
              //   path: "coursepicker",
              //   element: <Coursepicker />,
              //   loader: coursepickerLoader,
              // },
            ],
          },
        ],
      },
      {
        path: "/workspace/:workspaceUrlName",
        element: <RootLayout />,
        errorElement: <RootLayout isErrorBoundary />,
        middleware: [authMiddleware, workspaceMiddleware],
        loader: routeLoaders.workspaceLoader,
        handle: {
          secondaryNav: {
            type: "workspace",
          },
        },
        children: [
          {
            errorElement: <ErrorBoundary />,
            children: [
              {
                index: true,
                element: <WorkspaceHome />,
                loader: routeLoaders.workspaceHomeLoader,
                middleware: [permissionMiddlewares.workspaceHomeView],
              },
              {
                path: "workspaceManagement",
                element: <WorkspaceSettings />,
                loader: routeLoaders.workspaceSettingsLoader,
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
              {
                path: "*",
                element: <NotFound />,
              },

              // Future routes can be added here with their own loaders
              // {
              //   path: "coursepicker",
              //   element: <Coursepicker />,
              //   loader: coursepickerLoader,
              // },
            ],
          },
        ],
      },
      {
        path: "login",
        element: null, // This will never render, route loader will handle the redirect, which backend catches
        loader: () => {
          // This loader will run before the component renders
          window.location.replace(`/login?redirectUrl=${window.location.href}`);
          return null;
        },
      },
      {
        path: "logout",
        element: null, // This will never render, route loader will handle the redirect, which backend catches
        loader: () => {
          // This loader will run before the component renders
          window.location.replace(`/logout`);
          return null;
        },
      },
    ],
  },
]);
