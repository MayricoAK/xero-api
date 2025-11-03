import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <main className="flex-1 flex flex-col">
          {/* Mobile sidebar trigger */}
          <div className="flex items-center p-4 border-b lg:hidden">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">
              Payment Approval System
            </h1>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto bg-background">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
