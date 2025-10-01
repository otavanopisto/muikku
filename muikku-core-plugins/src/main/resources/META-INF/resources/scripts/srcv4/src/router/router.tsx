import { createBrowserRouter } from "react-router";
import {
  workspaceLoader,
  homeLoader,
  dashboardLoader,
  workspaceHomeLoader,
  workspaceSettingsLoader,
  communicatorLoader,
} from "~/src/router/routeLoaders";
import { SharedLayout } from "~/src/layout/SharedLayout/SharedLayout";
import {
  authMiddleware,
  permissionMiddlewares,
  workspaceMiddleware,
} from "~/src/router/middleware";
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
  NotFound,
} from "~/src/pages/";
import {
  ErrorBoundaryRoot,
  ErrorBoundaryPage,
  ErrorBoundaryLayout,
} from "~/src/components";
import { PageLayout } from "../layout/PageLayout/PageLayout";

// Router
export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundaryRoot />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
        loader: homeLoader,
        middleware: [authMiddleware, permissionMiddlewares.homeView],
      },
      {
        element: <SharedLayout />,
        errorElement: <ErrorBoundaryLayout />,
        loader: () => null,
        middleware: [authMiddleware],
        children: [
          {
            errorElement: <ErrorBoundaryPage />,
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
                loader: dashboardLoader,
                middleware: [permissionMiddlewares.dashboardView],
              },
              {
                path: "communicator",
                element: (
                  <PageLayout title="Viestin">
                    <Communicator />
                  </PageLayout>
                ),
                loader: communicatorLoader,
                middleware: [permissionMiddlewares.communicatorView],
              },
              {
                path: "coursepicker",
                element: (
                  <PageLayout title="Kurssipoimuri">
                    <Coursepicker />
                  </PageLayout>
                ),
                //loader: coursepickerLoader,
                middleware: [permissionMiddlewares.coursepickerView],
              },
              {
                path: "studies",
                element: (
                  <PageLayout title="Opinnot">
                    <Studies />
                  </PageLayout>
                ),
                //loader: studiesLoader,
                middleware: [permissionMiddlewares.studiesView],
              },
              {
                path: "hops",
                element: (
                  <PageLayout title="HOPS">
                    <Hops />
                  </PageLayout>
                ),
                // loader: hopsLoader,
                middleware: [permissionMiddlewares.hopsView],
              },
              {
                path: "guider",
                element: (
                  <PageLayout title="Opiskelijat">
                    <Guider />
                  </PageLayout>
                ),
                //loader: guiderLoader,
                middleware: [permissionMiddlewares.guiderView],
                children: [
                  {
                    index: true,
                    element: <>Opiskelijalistaus</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: "tasks",
                    element: <>Tehtävät</>,
                    //loader: guiderHomeLoader,
                  },
                  {
                    path: ":studentId",
                    //loader: guiderHomeLoader,
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
                      {
                        path: "files",
                        element: <>Tiedostot</>,
                        //loader: guiderHomeLoader,
                      },
                    ],
                  },
                ],
              },
              {
                path: "evaluation",
                element: (
                  <PageLayout title="Arviointi">
                    <Evaluation />
                  </PageLayout>
                ),
                //loader: evaluationLoader,
                middleware: [permissionMiddlewares.evaluationView],
              },
              {
                path: "organization",
                element: (
                  <PageLayout title="Organisaatio">
                    <Organization />
                  </PageLayout>
                ),
                //loader: organizationLoader,
                middleware: [permissionMiddlewares.organizationView],
              },
              {
                path: "announcements",
                element: (
                  <PageLayout title="Ilmoitukset">
                    <Announcements />
                  </PageLayout>
                ),
                //loader: announcementsLoader,
                middleware: [permissionMiddlewares.announcementsView],
              },
              {
                path: "announcer",
                element: (
                  <PageLayout title="Ilmoittaja">
                    <Announcer />
                  </PageLayout>
                ),
                //loader: announcerLoader,
                middleware: [permissionMiddlewares.announcerView],
              },
              {
                path: "profile",
                element: (
                  <PageLayout title="Profiili">
                    <Profile />
                  </PageLayout>
                ),
                //loader: profileLoader,
                middleware: [permissionMiddlewares.profileView],
              },

              {
                path: "appSettings",
                element: (
                  <PageLayout title="Asetukset">
                    <AppSettings />
                  </PageLayout>
                ),
                //loader: appSettingsLoader,
                middleware: [permissionMiddlewares.appSettingsView],
              },
              {
                path: "*",
                element: (
                  <PageLayout title="Ei löydy">
                    <NotFound />
                  </PageLayout>
                ),
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
        element: <SharedLayout context="workspace" />,
        errorElement: <ErrorBoundaryLayout context="workspace" />,
        middleware: [authMiddleware, workspaceMiddleware],
        loader: workspaceLoader,
        children: [
          {
            errorElement: <ErrorBoundaryPage />,
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
    ],
  },
]);
