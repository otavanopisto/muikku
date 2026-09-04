import "src/css/layers.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import { DevTools } from "jotai-devtools";
import { jotaiStore } from "./jotaiStore";
import { DebugAtoms } from "src/utils/DebugAtoms";
import App from "./App.tsx";
import { MathJaxContext } from "better-react-mathjax";
import { ThemedApp } from "./theme/ThemedApp.tsx";

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
      <Provider store={jotaiStore}>
        <ThemedApp>
          {process.env.NODE_ENV === "development" && (
            <>
              {/* <DebugAtoms /> */}
              {/* <DevTools store={jotaiStore} /> */}
            </>
          )}
          <App />
        </ThemedApp>
      </Provider>
    </MathJaxContext>
  </StrictMode>
);
