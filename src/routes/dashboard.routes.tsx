import { DashboardLayout } from "@/modules/dashboard/layout/dashboardLayout";
import Dashboard from "@/modules/dashboard/pages/dashboard";
import Lives from "@/modules/live/pages/live";
import Users from "@/modules/users/pages/users";

export const dashboardRoutes = [
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "live", element: <Lives /> },
    ],
  },
];
