import "src/css/layers.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import { jotaiStore } from "./jotaiStore";
import { DebugAtoms } from "src/utils/DebugAtoms";
import App from "./App.tsx";
import "src/index.css";
import { theme } from "./theme";
import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <MathJaxContext version={4} config={config}>
      <MantineProvider theme={theme}>
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
    </MathJaxContext>
  </StrictMode>
);
