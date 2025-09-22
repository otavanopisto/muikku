import { RouterProvider } from "react-router";
import { router } from "./router";

/**
 * App component
 * @returns React.ReactNode
 */
function App() {
  // The routing is now handled by createBrowserRouter
  return <RouterProvider router={router} />;
}

export default App;
