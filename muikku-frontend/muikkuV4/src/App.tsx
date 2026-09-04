import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "src/router/router";
import { DisconnectModal } from "src/components";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/utils";
import { queryClient } from "./queryClient";

/**
 * Hydrate the query client
 * @returns React.ReactNode
 */
function HydrateQueryClient() {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return null;
}

/**
 * App component
 * @returns React.ReactNode
 */
function App() {
  //const websocket = useAtomValue(websocketAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrateQueryClient />
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
