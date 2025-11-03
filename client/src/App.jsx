import { BrowserRouter, useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./router/routes";

function AppRoutes() {
  const routeElements = useRoutes(routes);
  return routeElements;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              border: "1px solid green",
            },
          },
          error: {
            style: {
              border: "1px solid red",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
