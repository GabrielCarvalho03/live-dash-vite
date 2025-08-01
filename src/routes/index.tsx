import { createBrowserRouter } from "react-router-dom";
import { Login } from "@/modules/auth/pages/Login";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { dashboardRoutes } from "./dashboard.routes";
import ForgotPassword from "@/modules/auth/pages/ForgotPassword";
import ForgotPasswordWithToken from "@/modules/auth/pages/forgotWithToken";

export const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [{ path: "/", element: <Login /> }],
  },
  {
    element: <PublicRoutes />,
    children: [
      { path: "/password/forgot/:token", element: <ForgotPasswordWithToken /> },
    ],
  },

  {
    element: <PublicRoutes />,
    children: [{ path: "/forgotPassword", element: <ForgotPassword /> }],
  },

  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/dashboard",
        children: dashboardRoutes,
      },
    ],
  },
]);
