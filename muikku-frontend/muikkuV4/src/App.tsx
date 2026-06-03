import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "src/router/router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { DisconnectModal } from "src/components";
import { websocketAtom } from "./atoms/websocket";
import { useAtomValue } from "jotai";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * App component
 * @returns React.ReactNode
 */
function App() {
  const websocket = useAtomValue(websocketAtom);
  // The routing is now handled by createBrowserRouter
  //return <RouterProvider router={router} />;

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* {process.env.NODE_ENV === "development" && (
        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
      )} */}
      <DisconnectModal />
    </QueryClientProvider>
  );
}

export default App;
