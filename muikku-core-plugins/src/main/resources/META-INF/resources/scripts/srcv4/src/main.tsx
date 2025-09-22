import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import { jotaiStore } from "./jotaiStore";
import { DebugAtoms } from "./utils/DebugAtoms";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "jotai-devtools/styles.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <MantineProvider>
      <Provider store={jotaiStore}>
        {process.env.NODE_ENV === "development" && (
          <>
            <DebugAtoms />
            <DevTools store={jotaiStore} />
          </>
        )}
        <App />
      </Provider>
    </MantineProvider>
  </StrictMode>
);
