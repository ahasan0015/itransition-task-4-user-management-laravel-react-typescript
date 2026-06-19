import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App.tsx";
import Login from "./components/pages/Login.tsx";
import Register from "./components/pages/Register.tsx";
import NotFound from "./components/pages/NotFound.tsx";
import ManageUsers from "./components/pages/ManageUser.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx"; // ইমপোর্ট করা হলো

const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        // Protected Route: Only accessible if logged in (token exists)
        element: <ProtectedRoute />,
        children: [{ path: "/users", element: <ManageUsers /> }],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={AppRoute} />
  </StrictMode>,
);
