import { Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/components/sidebar/siderbar";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background overflow-y-hidden">
      <Sidebar />
      <main className="flex-1 px-6 pt-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
