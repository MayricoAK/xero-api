import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import AppSidebar from "./AppSidebar";
import { XeroProvider } from "@/context/XeroContext";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <XeroProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full max-w-full overflow-hidden">
          <AppSidebar />
          <main className="flex-1 flex flex-col min-w-0">
            <header className="flex items-center justify-between p-3 sm:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <SidebarTrigger className="shrink-0" />
                <h1 className="text-sm sm:text-lg font-semibold truncate">
                  Payment Approval System
                </h1>
              </div>
              <div className="flex items-center gap-2 shrink-0"></div>
            </header>
            <div className="flex-1 overflow-auto bg-background p-0">
              <div className="w-full max-w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </XeroProvider>
  );
};

export default Layout;
