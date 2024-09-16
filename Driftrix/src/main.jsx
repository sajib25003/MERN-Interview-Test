import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Main from "./Layout/Main";
import Home from "./Pages/Home/Home";
import AllDrawings from "./Pages/AllDrawings/AllDrawings";
import EditDrawings from "./Pages/AllDrawings/EditDrawings";
import { HelmetProvider } from "react-helmet-async";

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/drawings",
        element: <AllDrawings></AllDrawings>,
      },
      {
        path: "/edit/:id",
        element: <EditDrawings></EditDrawings>,
      },
    ],
  },
]);

// Render the app with RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <div className="max-w-screen-2xl">
        <RouterProvider router={router} />
      </div>
    </HelmetProvider>
  </React.StrictMode>
);
