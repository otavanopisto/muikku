import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router";
import { jotaiStore } from "./jotaiStore.ts";
import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import { DebugAtoms } from "./utils/DebugAtoms.ts";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Provider store={jotaiStore}>
          {process.env.NODE_ENV === "development" && (
            <>
              <DebugAtoms />
              <DevTools />
            </>
          )}
          <App />
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
